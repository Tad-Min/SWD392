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

export default function RescueCoordinator() {
    const { getRescueRequest } = useRescueRequest();
    const { getRescueTeam } = useRescueTeam();
    const { loading: missionLoading, createRescueMission } = useCreateRescueMission();

    const [requests, setRequests] = useState([]);
    const [teams, setTeams] = useState([]);
    const [dispatchTarget, setDispatchTarget] = useState(null);

    // Fetch data from API on mount
    useEffect(() => {
        (async () => {
            try {
                const reqData = await getRescueRequest();
                setRequests(reqData ?? []);
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
                <MapLayer requests={requests} teams={teams} onDispatch={handleDispatch} />
            </div>

            {/* Right Sidebar — Team Panel */}
            <TeamPanel teams={teams} />

            {/* Bottom Panel — Queue */}
            <QueuePanel requests={requests} onDispatch={handleDispatch} />

            {/* Dispatch Modal */}
            {dispatchTarget && (
                <DispatchModal
                    request={dispatchTarget}
                    teams={teams}
                    loading={missionLoading}
                    onClose={() => setDispatchTarget(null)}
                    onConfirm={handleConfirmDispatch}
                />
            )}
        </div>
    );
}
