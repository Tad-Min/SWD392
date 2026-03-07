import { useState, useRef } from 'react';
import api from '../../config/axios';

const TestAttachment = () => {
    const [activeTab, setActiveTab] = useState('rescue'); // 'rescue' | 'mission'

    // Rescue Request
    const [rescueRequestId, setRescueRequestId] = useState('');
    const [rescueFiles, setRescueFiles] = useState([]);
    const [rescueUploading, setRescueUploading] = useState(false);
    const [rescueResult, setRescueResult] = useState(null);
    const rescueFileRef = useRef(null);

    // Mission
    const [missionId, setMissionId] = useState('');
    const [missionFiles, setMissionFiles] = useState([]);
    const [missionUploading, setMissionUploading] = useState(false);
    const [missionResult, setMissionResult] = useState(null);
    const missionFileRef = useRef(null);

    // Log
    const [logs, setLogs] = useState([]);

    const addLog = (type, text) => {
        setLogs(prev => [{ id: Date.now(), type, text, time: new Date().toLocaleTimeString('vi-VN') }, ...prev]);
    };

    // Handle file selection with preview
    const handleFileSelect = (e, type) => {
        const files = Array.from(e.target.files);
        const fileData = files.map(file => ({
            file,
            name: file.name,
            size: file.size,
            type: file.type,
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) :
                file.type.startsWith('video/') ? URL.createObjectURL(file) : null,
            isVideo: file.type.startsWith('video/'),
            isImage: file.type.startsWith('image/'),
        }));

        if (type === 'rescue') {
            setRescueFiles(prev => [...prev, ...fileData]);
        } else {
            setMissionFiles(prev => [...prev, ...fileData]);
        }
    };

    const removeFile = (type, index) => {
        if (type === 'rescue') {
            setRescueFiles(prev => {
                const updated = [...prev];
                if (updated[index].preview) URL.revokeObjectURL(updated[index].preview);
                updated.splice(index, 1);
                return updated;
            });
        } else {
            setMissionFiles(prev => {
                const updated = [...prev];
                if (updated[index].preview) URL.revokeObjectURL(updated[index].preview);
                updated.splice(index, 1);
                return updated;
            });
        }
    };

    // Upload for Rescue Request (Chunked)
    const uploadRescueAttachments = async () => {
        if (!rescueRequestId || rescueFiles.length === 0) {
            addLog('error', '❌ Vui lòng nhập RescueRequest ID và chọn file');
            return;
        }
        setRescueUploading(true);
        const CHUNK_SIZE = 1024 * 1024 * 2; // 2MB chunks

        try {
            // Promise.all to support concurrent multiple file uploads
            await Promise.all(rescueFiles.map(async (fileData) => {
                const totalSize = fileData.size;
                const totalChunks = Math.ceil(totalSize / CHUNK_SIZE);

                // Step 1: Create Attachment Metadata to get AttachmentId
                const createRes = await api.post('Attachment/rescue/create-attachment', {
                    rescueRequestId: parseInt(rescueRequestId),
                    fileSize: totalSize,
                    fileType: fileData.type || 'application/octet-stream'
                });

                const attachmentId = createRes.data.attachmentId;
                addLog('info', `⏳ Created Attachment [${attachmentId}] cho file ${fileData.name}. Bắt đầu gửi ${totalChunks} chunks...`);

                // Step 2: Upload Chunks Sequentially
                for (let sequenceNumber = 1; sequenceNumber <= totalChunks; sequenceNumber++) {
                    const startByte = (sequenceNumber - 1) * CHUNK_SIZE;
                    const endByte = Math.min(startByte + CHUNK_SIZE, totalSize);
                    const chunkBlob = fileData.file.slice(startByte, endByte);

                    const isLastChunk = sequenceNumber === totalChunks;

                    const formData = new FormData();
                    formData.append('AttachmentId', attachmentId);
                    formData.append('SequenceNumber', sequenceNumber);
                    formData.append('IsLastChunk', isLastChunk);
                    // The backend expects an IFormFile named "FileChunk"
                    formData.append('FileChunk', chunkBlob, fileData.name);

                    await api.post('Attachment/chunk', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    addLog('info', `  - Uploaded chunk ${sequenceNumber}/${totalChunks} của file ${fileData.name}`);
                }
                addLog('success', `✅ Hoàn thành file: ${fileData.name} → RescueRequest #${rescueRequestId}`);
            }));

            setRescueResult({ success: true, message: `Đã upload ${rescueFiles.length} file thành công` });
            setRescueFiles([]);
            if (rescueFileRef.current) rescueFileRef.current.value = '';
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            addLog('error', `❌ Upload thất bại: ${msg}`);
            setRescueResult({ success: false, message: msg });
        } finally {
            setRescueUploading(false);
        }
    };

    // Upload for Mission (Chunked)
    const uploadMissionAttachments = async () => {
        if (!missionId || missionFiles.length === 0) {
            addLog('error', '❌ Vui lòng nhập Mission ID và chọn file');
            return;
        }
        setMissionUploading(true);
        const CHUNK_SIZE = 1024 * 1024 * 2; // 2MB chunks

        try {
            await Promise.all(missionFiles.map(async (fileData) => {
                const totalSize = fileData.size;
                const totalChunks = Math.ceil(totalSize / CHUNK_SIZE);

                // Step 1: Create Attachment Metadata
                const createRes = await api.post('Attachment/mission/create-attachment', {
                    missionId: parseInt(missionId),
                    fileSize: totalSize,
                    fileType: fileData.type || 'application/octet-stream'
                });

                const attachmentId = createRes.data.attachmentId;
                addLog('info', `⏳ Created Attachment [${attachmentId}] cho file ${fileData.name}. Bắt đầu gửi ${totalChunks} chunks...`);

                // Step 2: Upload Chunks Sequentially
                for (let sequenceNumber = 1; sequenceNumber <= totalChunks; sequenceNumber++) {
                    const startByte = (sequenceNumber - 1) * CHUNK_SIZE;
                    const endByte = Math.min(startByte + CHUNK_SIZE, totalSize);
                    const chunkBlob = fileData.file.slice(startByte, endByte);

                    const isLastChunk = sequenceNumber === totalChunks;

                    const formData = new FormData();
                    formData.append('AttachmentId', attachmentId);
                    formData.append('SequenceNumber', sequenceNumber);
                    formData.append('IsLastChunk', isLastChunk);
                    formData.append('FileChunk', chunkBlob, fileData.name);

                    await api.post('Attachment/chunk', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    addLog('info', `  - Uploaded chunk ${sequenceNumber}/${totalChunks} của file ${fileData.name}`);
                }
                addLog('success', `✅ Hoàn thành file: ${fileData.name} → Mission #${missionId}`);
            }));

            setMissionResult({ success: true, message: `Đã upload ${missionFiles.length} file thành công` });
            setMissionFiles([]);
            if (missionFileRef.current) missionFileRef.current.value = '';
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            addLog('error', `❌ Upload thất bại: ${msg}`);
            setMissionResult({ success: false, message: msg });
        } finally {
            setMissionUploading(false);
        }
    };

    const tabs = [
        { key: 'rescue', label: '🆘 Rescue Request', color: 'rose' },
        { key: 'mission', label: '🎯 Mission', color: 'amber' },
    ];

    const FilePreviewGrid = ({ files, type }) => (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
            {files.map((f, i) => (
                <div key={i} className="relative group bg-slate-900/50 border border-slate-700/50 rounded-xl overflow-hidden">
                    {f.isImage && f.preview && (
                        <img src={f.preview} alt={f.name} className="w-full h-32 object-cover" />
                    )}
                    {f.isVideo && f.preview && (
                        <video src={f.preview} className="w-full h-32 object-cover" muted />
                    )}
                    {!f.isImage && !f.isVideo && (
                        <div className="w-full h-32 flex items-center justify-center bg-slate-800">
                            <span className="text-3xl">📄</span>
                        </div>
                    )}
                    <div className="p-2">
                        <p className="text-xs text-slate-300 truncate font-medium">{f.name}</p>
                        <p className="text-[10px] text-slate-500">{(f.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button
                        onClick={() => removeFile(type, i)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold"
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 text-white p-6">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                        📸 Test Attachment Upload
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Upload hình ảnh hoặc video cho RescueRequest và Mission</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.key
                                ? `bg-${tab.color}-600 text-white shadow-lg shadow-${tab.color}-500/30`
                                : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Upload Panel */}
                    <div className="lg:col-span-2">
                        <div className="bg-slate-800/60 backdrop-blur border border-slate-700/50 rounded-2xl p-6 space-y-4">

                            {activeTab === 'rescue' ? (
                                <>
                                    <h3 className="text-lg font-bold text-rose-400">🆘 Upload cho Rescue Request</h3>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 mb-1.5">Rescue Request ID</label>
                                        <input
                                            type="number"
                                            placeholder="Nhập ID..."
                                            value={rescueRequestId}
                                            onChange={e => setRescueRequestId(e.target.value)}
                                            className="w-full bg-slate-900/60 border border-slate-600 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-rose-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 mb-1.5">Chọn ảnh / video</label>
                                        <input
                                            ref={rescueFileRef}
                                            type="file"
                                            accept="image/*,video/*"
                                            multiple
                                            onChange={e => handleFileSelect(e, 'rescue')}
                                            className="block w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-rose-600 file:text-white hover:file:bg-rose-500"
                                        />
                                    </div>
                                    {rescueFiles.length > 0 && <FilePreviewGrid files={rescueFiles} type="rescue" />}
                                    <button
                                        onClick={uploadRescueAttachments}
                                        disabled={rescueUploading || !rescueRequestId || rescueFiles.length === 0}
                                        className="w-full py-3 bg-rose-600 hover:bg-rose-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                                    >
                                        {rescueUploading ? (
                                            <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Đang upload...</>
                                        ) : (
                                            <>📤 Upload {rescueFiles.length} file</>
                                        )}
                                    </button>
                                    {rescueResult && (
                                        <div className={`text-sm p-3 rounded-xl ${rescueResult.success ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                            {rescueResult.message}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <h3 className="text-lg font-bold text-amber-400">🎯 Upload cho Mission</h3>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 mb-1.5">Mission ID</label>
                                        <input
                                            type="number"
                                            placeholder="Nhập ID..."
                                            value={missionId}
                                            onChange={e => setMissionId(e.target.value)}
                                            className="w-full bg-slate-900/60 border border-slate-600 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 mb-1.5">Chọn ảnh / video</label>
                                        <input
                                            ref={missionFileRef}
                                            type="file"
                                            accept="image/*,video/*"
                                            multiple
                                            onChange={e => handleFileSelect(e, 'mission')}
                                            className="block w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-amber-600 file:text-white hover:file:bg-amber-500"
                                        />
                                    </div>
                                    {missionFiles.length > 0 && <FilePreviewGrid files={missionFiles} type="mission" />}
                                    <button
                                        onClick={uploadMissionAttachments}
                                        disabled={missionUploading || !missionId || missionFiles.length === 0}
                                        className="w-full py-3 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                                    >
                                        {missionUploading ? (
                                            <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Đang upload...</>
                                        ) : (
                                            <>📤 Upload {missionFiles.length} file</>
                                        )}
                                    </button>
                                    {missionResult && (
                                        <div className={`text-sm p-3 rounded-xl ${missionResult.success ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                            {missionResult.message}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Activity Log */}
                    <div className="bg-slate-800/60 backdrop-blur border border-slate-700/50 rounded-2xl flex flex-col overflow-hidden">
                        <div className="px-5 py-3 border-b border-slate-700/50 flex items-center justify-between shrink-0">
                            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">📋 Upload Log</h3>
                            <button onClick={() => setLogs([])} className="text-xs text-slate-500 hover:text-slate-300">Xóa</button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 max-h-[500px] font-mono text-xs">
                            {logs.length === 0 ? (
                                <p className="text-slate-500 text-center py-8">Chưa có hoạt động upload nào.</p>
                            ) : (
                                logs.map(entry => (
                                    <div key={entry.id} className="flex gap-2">
                                        <span className="text-slate-600 shrink-0">[{entry.time}]</span>
                                        <span className={entry.type === 'success' ? 'text-emerald-400' : entry.type === 'error' ? 'text-red-400' : 'text-slate-300'}>
                                            {entry.text}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestAttachment;
