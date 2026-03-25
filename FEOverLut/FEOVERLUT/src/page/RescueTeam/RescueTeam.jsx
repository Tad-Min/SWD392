import React, { useState, useEffect } from 'react';
import RescueSidebar from './components/RescueSidebar';
import MissionList from './components/MissionList';
import MissionDetail from './components/MissionDetail';
import TeamInfo from './components/TeamInfo';
import MyProfileModal from '../../components/MyProfileModal';
import NotificationBell from '../../components/NotificationBell';
import { useRescueTeamById, useGetRescueTeamMemberByTeamId, useGetRescueTeamMemberRoleById } from '../../features/Rescue/hook/useRescueTeam';
import { useUserById } from '../../features/users/hook/useUsers';
import { useRealtimeRescueMissions } from './WebSocket/useRealtimeRescueMissions.jsx';

const RescueTeam = () => {
    // State for navigation
    const [activeTab, setActiveTab] = useState('missions');
    const [selectedMission, setSelectedMission] = useState(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const theme = {
        bg: isDarkMode ? 'bg-[#121A22]' : 'bg-[#f8fafc]',
        mainBg: isDarkMode ? 'bg-[#0F1722]' : 'bg-[#f1f5f9]',
        headerBg: isDarkMode ? 'bg-[#0A1128]/90' : 'bg-white/90',
        sidebarBg: isDarkMode ? 'bg-[#0F172A]' : 'bg-white',
        border: isDarkMode ? 'border-slate-800' : 'border-slate-200',
        headerBorder: isDarkMode ? 'border-slate-700/50' : 'border-slate-300',
        text: isDarkMode ? 'text-slate-200' : 'text-slate-800',
        textTitle: isDarkMode ? 'text-white' : 'text-slate-900',
        textMuted: isDarkMode ? 'text-slate-400' : 'text-slate-500',
        navActiveNode: isDarkMode ? 'bg-red-500/10 text-red-500 border-r-2 border-red-500' : 'bg-red-50 text-red-600 border-r-[3px] border-red-600',
        navHover: isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-100',
        cardBg: isDarkMode ? 'bg-[#1E293B]/70' : 'bg-white',
        inputBg: isDarkMode ? 'bg-[#0F172A]' : 'bg-white',
        inputBorder: isDarkMode ? 'border-slate-700/80' : 'border-slate-300',
        glassEffect: 'backdrop-blur-md',
        iconHover: isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-200',
        themeToggleBg: isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'
    };

    // Team data state
    const [teamData, setTeamData] = useState(null); // { teamId, teamName, statusId, ... }
    const [teamMembers, setTeamMembers] = useState([]); // [{ userId, teamId, roleId, userName, roleName }]
    const [resolvedTeamId, setResolvedTeamId] = useState(null);
    const [teamLoading, setTeamLoading] = useState(true);

    // Realtime missions hook – automatically polls & listens for new assignments
    const { missions, setMissions, loading: missionsLoading, refetch: refetchMissions } = useRealtimeRescueMissions(resolvedTeamId);

    const dataLoading = teamLoading || missionsLoading;

    // Hooks
    const { getRescueTeamById } = useRescueTeamById();
    const { getRescueTeamMemberByTeamId } = useGetRescueTeamMemberByTeamId();
    const { getRescueTeamMemberRoleById } = useGetRescueTeamMemberRoleById();
    const { getUserById } = useUserById();

    useEffect(() => {
        const fetchTeamData = async () => {
            try {
                setTeamLoading(true);
                const userId = localStorage.getItem('userId');
                if (!userId) return;

                // Step 1: Get team info for the logged-in user
                const team = await getRescueTeamById(userId);
                if (!team) return;

                // team could be a single object or array – normalise
                const teamObj = Array.isArray(team) ? team[0] : team;
                if (!teamObj) {
                    console.warn('No team found for this user');
                    return;
                }
                setTeamData(teamObj);

                const teamId = teamObj.teamId || teamObj.id;
                if (!teamId) return;

                // Step 2: Get all members of this team
                const members = await getRescueTeamMemberByTeamId(teamId);
                if (!members || !Array.isArray(members)) {
                    setTeamMembers([]);
                    return;
                }

                // Step 3: Enrich each member with user info and role name
                const enriched = await Promise.all(
                    members.map(async (m) => {
                        let userName = '';
                        let identifyId = '';
                        let roleName = '';

                        try {
                            const user = await getUserById(m.userId);
                            userName = user?.fullName || '';
                            identifyId = user?.identifyId || '';
                        } catch { /* ignore */ }

                        try {
                            const role = await getRescueTeamMemberRoleById(m.roleId);
                            roleName = role?.roleName || '';
                        } catch { /* ignore */ }

                        return {
                            ...m,
                            userName,
                            identifyId,
                            roleName,
                        };
                    })
                );

                setTeamMembers(enriched);

                // Step 4: Set the resolved team ID so the realtime hook kicks in
                const actualTeamId = teamObj?.teamId || teamObj?.id;
                if (actualTeamId) {
                    setResolvedTeamId(actualTeamId);
                }

            } catch (err) {
                console.error('Error fetching team data:', err);
            } finally {
                setTeamLoading(false);
            }
        };

        fetchTeamData();
    }, []);

    // Build the team label for sidebar / header
    const teamLabel = teamData
        ? `${teamData.teamName || 'Team'}`
        : 'Đội Cứu Hộ';
    const teamIdLabel = teamData
        ? `MÃ ĐỘI: ${teamData.teamName || 'Team'}-${teamData.teamId || teamData.id || '01'}`
        : 'MÃ ĐỘI: RT-ALPHA-01';

    const updateMissionStatus = (missionId, newStatusId) => {
        setMissions(prevMissions => prevMissions.map(m => {
            const id = m.missionId || m.MissionId || m.id || m.rescueMissionId;
            if (id === missionId) {
                return { ...m, statusId: newStatusId, StatusId: newStatusId };
            }
            return m;
        }));

        if (selectedMission) {
            const id = selectedMission.missionId || selectedMission.MissionId || selectedMission.id || selectedMission.rescueMissionId;
            if (id === missionId) {
                setSelectedMission({ ...selectedMission, statusId: newStatusId, StatusId: newStatusId });
            }
        }
    };

    // Render content based on active tab and selected mission
    const renderContent = () => {
        if (activeTab === 'missions') {
            if (selectedMission) {
                return (
                    <MissionDetail
                        mission={selectedMission}
                        onBack={() => setSelectedMission(null)}
                        teamIdLabel={teamIdLabel}
                        theme={theme}
                        onMissionUpdate={updateMissionStatus}
                    />
                );
            }
            return <MissionList
                onSelectMission={setSelectedMission}
                teamIdLabel={teamIdLabel}
                theme={theme}
                missions={missions}
                loading={dataLoading}
            />;
        }

        if (activeTab === 'teamInfo') {
            return <TeamInfo teamIdLabel={teamIdLabel} members={teamMembers} loading={dataLoading} theme={theme} />;
        }

        if (activeTab === 'messages') {
            return (
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                    <div className="text-slate-500 flex flex-col items-center gap-4">
                        <svg className="w-16 h-16 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <p className="text-lg">Tính năng tin nhắn đang được phát triển.</p>
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <div className={`flex h-screen w-full ${theme.bg} ${theme.text} overflow-hidden font-sans transition-colors duration-300`}>
            <RescueSidebar
                activeTab={activeTab}
                setActiveTab={(tab) => {
                    setActiveTab(tab);
                    if (tab !== 'missions') setSelectedMission(null);
                }}
                teamLabel={teamLabel}
                onOpenProfile={() => setIsProfileOpen(true)}
                isSidebarOpen={isSidebarOpen}
                theme={theme}
                isDarkMode={isDarkMode}
            />

            <main className={`flex-1 flex flex-col h-full ${theme.mainBg} overflow-hidden transition-colors duration-300`}>
                {/* Header Navbar */}
                <header className={`h-20 flex-shrink-0 ${theme.headerBg} ${theme.glassEffect} border-b ${theme.headerBorder} flex items-center justify-between px-6 lg:px-10 z-20 transition-colors duration-300`}>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className={`p-2 rounded-lg ${theme.iconHover} transition-colors focus:outline-none ${theme.textMuted}`}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                            </svg>
                        </button>
                        <div>
                            <h1 className={`text-xl font-bold tracking-tight ${theme.textTitle}`}>Bảng điều khiển</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                        {/* Dark/Light mode toggle */}
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className={`w-10 h-10 rounded-full ${theme.themeToggleBg} transition-colors flex items-center justify-center ${theme.textMuted}`}
                        >
                            {isDarkMode ? (
                                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                </svg>
                            )}
                        </button>

                        {/* Notifications */}
                        <NotificationBell theme={theme} />
                    </div>
                </header>

                {dataLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full shadow-lg shadow-blue-500/20"></div>
                            <p className={`text-sm font-medium ${theme.textMuted} animate-pulse`}>Đang tải dữ liệu đội cứu trợ...</p>
                        </div>
                    </div>
                ) : !teamData ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                        <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
                            <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className={`text-2xl font-black mb-3 ${theme.textTitle}`}>Không tìm thấy dữ liệu Đội</h2>
                        <p className={`max-w-md ${theme.textMuted} mb-8 leading-relaxed`}>
                            Tài khoản của bạn hiện chưa được phân công vào bất kỳ Đội cứu hộ nào hoặc dữ liệu đội đã bị xóa khỏi hệ thống. Vui lòng liên hệ Điều phối viên để được hỗ trợ.
                        </p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all border border-white/5 active:scale-95"
                        >
                            Thử tải lại trang
                        </button>
                    </div>
                ) : (
                    renderContent()
                )}
            </main>

            <MyProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} isDarkMode={isDarkMode} theme={theme} />
        </div>
    );
};

export default RescueTeam;
