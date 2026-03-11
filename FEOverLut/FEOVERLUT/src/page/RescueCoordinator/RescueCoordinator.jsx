import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import TaskBar from '../../components/TaskBar';

import MapLayer from './components/MapLayer';
import TeamPanel from './components/TeamPanel';
import QueuePanel from './components/QueuePanel';
import DispatchModal from './components/DispatchModal';
import MissionManagerModal from './components/MissionManagerModal';
import { Briefcase } from 'lucide-react';

import { useRescueRequest, useUpdateRescueRequest } from '../../features/Rescue/hook/useRescueRequest';
import { useRescueTeam, useUpdateRescueTeam } from '../../features/Rescue/hook/useRescueTeam';
import { useCreateRescueMission } from '../../features/Rescue/hook/useRescueMission';
import { useUpdateVehicle, useVehicle } from '../../features/Vehicle/hook/useVehicle';
import { getUserByIdApi } from '../../features/users/api/usersApi';

export default function RescueCoordinator() {
    const { getRescueRequest } = useRescueRequest();
    const { updateRescueRequest } = useUpdateRescueRequest();
    const { getRescueTeam } = useRescueTeam();
    const { updateRescueTeam } = useUpdateRescueTeam();
    const { loading: missionLoading, createRescueMission } = useCreateRescueMission();
    const { fetchVehicle } = useVehicle();
    const { updateVehicle } = useUpdateVehicle();

    const [requests, setRequests] = useState([]);
    const [teams, setTeams] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [dispatchTarget, setDispatchTarget] = useState(null);
    const [userMap, setUserMap] = useState({});
    const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);

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
            try {
                const vRes = await fetchVehicle();
                const vData = vRes?.data ?? vRes ?? [];
                setVehicles(Array.isArray(vData) ? vData : []);
            } catch (err) {
                console.error('Failed to fetch vehicles:', err);
                setVehicles([]);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Dispatch handler
    const handleDispatch = (request) => setDispatchTarget(request);

    const handleConfirmDispatch = async (missionData) => {
        try {
            const { rescueRequestId, teamId, vehicleId, description } = missionData;
            const payload = { rescueRequestId, teamId, description };
            await createRescueMission(payload);

            // Update RescueRequest Status to Assigned (3)
            if (rescueRequestId) {
                try {
                    const req = dispatchTarget;
                    await updateRescueRequest(rescueRequestId, {
                        requestType: req.requestType ?? 1,
                        urgencyLevel: req.urgencyLevel ?? 1,
                        status: 3, // Assigned
                        peopleCount: req.peopleCount ?? 1,
                        locationText: req.locationText ?? '',
                    });
                } catch (e) {
                    console.error('Failed to update request status:', e?.response?.status, e?.response?.data, e);
                }
            }

            // Update Team Status via RescueTeam entity update (PUT RescueTeam/{id})
            if (teamId) {
                try {
                    const team = teams.find(t => t.teamId === teamId);
                    if (team) {
                        await updateRescueTeam(teamId, {
                            teamId: teamId,
                            teamName: team.teamName,
                            statusId: 2, // Assigned/Busy
                            isActive: team.isActive ?? true,
                        });
                    }
                } catch (e) {
                    console.error('Failed to change team status:', e?.response?.status, e?.response?.data, e);
                }
            }

            // Update Vehicle Status via Vehicle entity update (PUT Vehicle/Vehicle/{id})
            if (vehicleId) {
                try {
                    const vehicle = vehicles?.find(v => v.vehicleId === vehicleId);
                    if (vehicle) {
                        await updateVehicle(vehicleId, {
                            vehicleId: vehicleId,
                            vehicleCode: vehicle.vehicleCode,
                            vehicleType: vehicle.vehicleType,
                            capacity: vehicle.capacity,
                            statusId: 2, // In Use
                            note: vehicle.note ?? '',
                        });
                    }
                } catch (e) {
                    console.error('Failed to change vehicle status:', e?.response?.status, e?.response?.data, e);
                }
            }

            // Remove dispatched request from queue
            setRequests((prev) =>
                prev.filter(
                    (r) =>
                        (r.id ?? r.rescueRequestId) !==
                        (dispatchTarget.id ?? dispatchTarget.rescueRequestId)
                )
            );
            setDispatchTarget(null);

            // Refetch teams to reflect status change
            try {
                const teamData = await getRescueTeam();
                setTeams(teamData ?? []);
            } catch (err) { }

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

            {/* Quản Lý Chung button */}
            <div className="absolute bottom-4 right-4 z-[60] w-64 md:w-72">
                <button
                    onClick={() => setIsMissionModalOpen(true)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-slate-900/90 hover:bg-slate-800/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl transition-all group"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <Briefcase className="w-4 h-4 text-blue-400" />
                        </div>
                        <span className="text-sm font-bold text-white">Quản Lý chung</span>
                    </div>
                </button>
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

            {/* Mission Manager Modal */}
            <MissionManagerModal
                isOpen={isMissionModalOpen}
                onClose={() => setIsMissionModalOpen(false)}
                teams={teams}
            />
        </div>
    );
}
