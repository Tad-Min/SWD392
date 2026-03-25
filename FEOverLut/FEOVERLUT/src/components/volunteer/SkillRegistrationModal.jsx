import React, { useState, useEffect } from 'react';
import { useVolunteerSkills } from '../../features/volunteer/hook/useVolunteer';
import { translateSkill } from '../../utils/vnTranslations';

const SkillRegistrationModal = ({ isOpen, onClose }) => {
    const { skillTypes, fetchSkillTypes, setSkills, isLoading } = useVolunteerSkills();
    const [selectedSkills, setSelectedSkills] = useState([]);

    useEffect(() => {
        if (isOpen) {
            fetchSkillTypes();
        }
    }, [isOpen, fetchSkillTypes]);

    const toggleSkill = (id) => {
        setSelectedSkills(prev => 
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await setSkills(selectedSkills);
            onClose();
        } catch (error) {
            // Error handled in hook
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md bg-[#1e253c] border border-blue-500/30 rounded-2xl shadow-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"></div>
                
                <h3 className="text-xl font-bold text-white mb-2">Đăng ký Kỹ năng Tình nguyện</h3>
                <p className="text-sm text-slate-400 mb-6">
                    Mỗi khi có yêu cầu, hệ thống sẽ tự động ghép nhóm cho bạn với các kỹ năng phù hợp. Bạn sẽ nhận được Email thông báo **Điểm Tập Kết** cụ thể.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                        {skillTypes?.map((skill) => (
                            <label key={skill.skillTypeId} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${selectedSkills.includes(skill.skillTypeId) ? 'bg-blue-500/20 border-blue-500/50 text-blue-300' : 'bg-[#0f1525] border-white/5 text-slate-300 hover:bg-[#1e253c]'}`}>
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-slate-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900 bg-slate-700"
                                    checked={selectedSkills.includes(skill.skillTypeId)}
                                    onChange={() => toggleSkill(skill.skillTypeId)}
                                />
                                <span className="text-sm font-bold tracking-tight">{translateSkill(skill.skillName)}</span>
                            </label>
                        ))}
                    </div>

                    <div className="flex gap-3 justify-end mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 transition-colors">
                            Hủy
                        </button>
                        <button type="submit" disabled={isLoading || selectedSkills.length === 0} className="px-6 py-2 rounded-lg text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 transition-colors shadow-lg shadow-blue-500/25">
                            {isLoading ? 'Đang lưu...' : 'Lưu lại'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SkillRegistrationModal;
