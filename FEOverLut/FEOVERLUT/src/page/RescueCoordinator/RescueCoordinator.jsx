import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import TaskBar from '../../components/TaskBar';

import MapLayer from './components/MapLayer';
import TeamPanel from './components/TeamPanel';
import QueuePanel from './components/QueuePanel';
import DispatchModal from './components/DispatchModal';

import { useRescueRequest } from '../../features/Rescue/hook/useRescueRequest';
import { useRescueTeam } from '../../features/Rescue/hook/useRescueTeam';
import { useCreateRescueMission } from '../../features/Rescue/hook/useRescueMission';
import { getUserByIdApi } from '../../features/users/api/usersApi';

export default function RescueCoordinator() {
    const { getRescueRequest } = useRescueRequest();
    const { getRescueTeam } = useRescueTeam();
    const { loading: missionLoading, createRescueMission } = useCreateRescueMission();

    const [requests, setRequests] = useState([]);
    const [teams, setTeams] = useState([]);
    const [dispatchTarget, setDispatchTarget] = useState(null);
    const [userMap, setUserMap] = useState({});
    // Fetch data from API on mount
    useEffect(() => {
        (async () => {
            try {
                const reqData = await getRescueRequest();
                const reqs = reqData ?? [];
                setRequests(reqs);

                // Fetch user info for each unique userReqId
                const uniqueUserIds = [...new Set(reqs.map((r) => r.userReqId).filter(Boolean))];
                const newMap = {};
                await Promise.all(
                    uniqueUserIds.map(async (uid) => {
                        try {
                            const res = await getUserByIdApi(uid);
                            // Assuming the response from getUserByIdApi is the user object directly, or res.data
                            const user = res?.data ?? res;
                            if (user) {
                                newMap[uid] = user.fullName || user.userName || user.email || 'Người dân';
                            }
                        } catch (err) {
                            console.error(`Failed to fetch user ${uid}:`, err);
                        }
                    })
                );
                setUserMap(newMap);
            } catch (err) {
                console.error('Failed to fetch rescue requests:', err);
                setRequests([]);
            }
            try {
                const teamData = await getRescueTeam();
                setTeams(teamData ?? []);
            } catch (err) {
                console.error('Failed to fetch rescue teams:', err);
                setTeams([]);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Dispatch handler
    const handleDispatch = (request) => setDispatchTarget(request);

    const handleConfirmDispatch = async (missionData) => {
        try {
            await createRescueMission(missionData);
            // Remove dispatched request from queue
            setRequests((prev) =>
                prev.filter(
                    (r) =>
                        (r.id ?? r.rescueRequestId) !==
                        (dispatchTarget.id ?? dispatchTarget.rescueRequestId)
                )
            );
            setDispatchTarget(null);
        } catch (err) {
            console.error('Dispatch failed:', err);
        }
    };

    return (
        <div className="relative w-full h-screen overflow-hidden bg-slate-950">
            {/* TaskBar */}
            <TaskBar />
            {/* Map — full-screen background layer */}
            <div className="absolute inset-0 z-0">
                <MapLayer requests={requests} teams={teams} userMap={userMap} onDispatch={handleDispatch} />
            </div>

            {/* Right Sidebar — Team Panel */}
            <TeamPanel teams={teams} />

            {/* Bottom Panel — Queue */}
            <QueuePanel requests={requests} userMap={userMap} onDispatch={handleDispatch} />

            {/* Dispatch Modal */}
            {dispatchTarget && (
                <DispatchModal
                    request={dispatchTarget}
                    teams={teams}
                    userMap={userMap}
                    loading={missionLoading}
                    onClose={() => setDispatchTarget(null)}
                    onConfirm={handleConfirmDispatch}
                />
            )}
        </div>
    );
}
