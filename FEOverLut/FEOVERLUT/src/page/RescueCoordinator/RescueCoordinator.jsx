import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import TaskBar from '../../components/TaskBar';

import MapLayer from './components/MapLayer';
import TeamPanel from './components/TeamPanel';
import QueuePanel from './components/QueuePanel';
import DispatchModal from './components/DispatchModal';
import MissionManagerModal from './components/MissionManagerModal';
import { Briefcase } from 'lucide-react';

import { useRealtimeRescueRequests } from '../useRealtimeRescueRequests.jsx';
import { useUpdateRescueRequest } from '../../features/Rescue/hook/useRescueRequest';
import { useRescueTeam, useUpdateRescueTeam } from '../../features/Rescue/hook/useRescueTeam';
import { useGetWareHouse } from '../../features/wareHouse/hook/useWareHouse';
import { useTransaction } from '../../features/transactions/hook/useTransaction';
import { useCreateRescueMission } from '../../features/Rescue/hook/useRescueMission';
import { useUpdateVehicle, useVehicle } from '../../features/Vehicle/hook/useVehicle';
import { useCreateAssignVehicle } from '../../features/Vehicle/hook/useAssignVehicle';
import { useRescueRequestStatus } from '../../features/status/hook/useRescueRequestStatus';

export default function RescueCoordinator() {
    // 🔴 Realtime rescue requests — auto-polls every 10s + WebSocket + toast notifications
    const { requests, setRequests, userMap } = useRealtimeRescueRequests();

    const { updateRescueRequest } = useUpdateRescueRequest();
    const { getRescueTeam } = useRescueTeam();
    const { updateRescueTeam } = useUpdateRescueTeam();
    const { loading: missionLoading, createRescueMission } = useCreateRescueMission();
    const { fetchVehicle } = useVehicle();
    const { updateVehicle } = useUpdateVehicle();
    const { createAssignVehicle } = useCreateAssignVehicle();
    const { getRescueRequestStatus } = useRescueRequestStatus();
    const { fetchWareHouse } = useGetWareHouse();
    const { createTransaction } = useTransaction();

    const [teams, setTeams] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [dispatchTarget, setDispatchTarget] = useState(null);
    const [requestStatusMap, setRequestStatusMap] = useState({});
    const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);

    // Fetch teams, vehicles, statuses on mount
    useEffect(() => {
        (async () => {
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
            try {
                const statusData = await getRescueRequestStatus();
                const sMap = {};
                (statusData ?? []).forEach(s => {
                    sMap[s.rescueRequestsStatusId] = s.statusName;
                });
                setRequestStatusMap(sMap);
            } catch (err) {
                console.error('Failed to fetch request statuses:', err);
            }
            try {
                const wData = await fetchWareHouse();
                setWarehouses(wData ?? []);
            } catch (err) {
                console.error('Failed to fetch warehouses:', err);
                setWarehouses([]);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Dispatch handler
    const handleDispatch = async (request) => {
        setDispatchTarget(request);
        const currentStatus = request.status ?? request.statusId;
        if (!currentStatus || currentStatus === 1) {
            try {
                await updateRescueRequest(request.id ?? request.rescueRequestId, {
                    ...request,
                    status: 2 // Verified
                });
                setRequests(prev => prev.map(r =>
                    (r.id ?? r.rescueRequestId) === (request.id ?? request.rescueRequestId)
                        ? { ...r, status: 2 }
                        : r
                ));
            } catch (err) {
                console.error('Failed to auto-update request to Verified:', err);
            }
        }
    };

    const handleConfirmDispatch = async (missionData) => {
        try {
            const { rescueRequestId, teamId, vehicleId, description, txData } = missionData;
            const payload = { rescueRequestId, teamId, description };
            const missionRes = await createRescueMission(payload);
            console.log("Create Mission Response:", missionRes);
            const missionId = missionRes?.data?.missionId ?? missionRes?.missionId ?? missionRes?.id ?? missionRes;

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
                            ...vehicle,
                            statusId: 2, // In Use
                        });

                        if (missionId) {
                            await createAssignVehicle({
                                missionId: missionId,
                                vehicleId: vehicleId,
                            });
                        } else {
                            console.warn('Cannot assign vehicle: missionId is missing from createRescueMission response', missionRes);
                        }
                    }
                } catch (e) {
                    console.error('Failed to change vehicle status:', e?.response?.status, e?.response?.data, e);
                }
            }

            // Create Inventory Transaction if txData is provided
            if (txData && missionId) {
                try {
                    await createTransaction({
                        ...txData,
                        missionId: missionId
                    });
                } catch (e) {
                    console.error('Failed to create inventory transaction:', e?.response?.status, e?.response?.data, e);
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
                <MapLayer requests={requests} teams={teams} warehouses={warehouses} userMap={userMap} requestStatusMap={requestStatusMap} onDispatch={handleDispatch} />
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
                    warehouses={warehouses}
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
