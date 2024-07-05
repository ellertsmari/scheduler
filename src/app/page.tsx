'use client'
import React, { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ConferenceDay, TimeSlot, PersonalScheduleItem } from './data';
import PersonalSchedule from './personalSchedule';

// Import your data
import conferenceData from './data';

const rooms = ["Sala Pio XII", "Sala Napoleonica", "Aula 1 Barelli", "Aula 3 Panighi", "Aula 2 Lazzati"];

type SelectedSessions = {
  [day: string]: {
    [time: string]: string;
  };
};



const ConferenceScheduleSelector: React.FC = () => {
  const [selectedSessions, setSelectedSessions] = useState<SelectedSessions>({});
  const [personalSchedule, setPersonalSchedule] = useState<PersonalScheduleItem[]>([]);

  const handleSessionChange = (day: string, time: string, value: string) => {
    setSelectedSessions(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [time]: value
      }
    }));
  };

  useEffect(() => {
    const newPersonalSchedule: PersonalScheduleItem[] = [];
    conferenceData.forEach((dayData: ConferenceDay) => {
      dayData.timeSlots.forEach((slot: TimeSlot) => {
        if ('sessions' in slot) {
          const selectedSession = selectedSessions[dayData.day]?.[slot.time];
          if (selectedSession) {
            const session = slot.sessions.find(s => s.name === selectedSession);
            if (session) {
              newPersonalSchedule.push({
                day: dayData.day,
                time: slot.time,
                session: session
              });
            }
          }
        } else if ('event' in slot) {
          newPersonalSchedule.push({
            day: dayData.day,
            time: slot.time,
            event: slot.event,
            room: slot.room
          });
        }
      });
    });
    setPersonalSchedule(newPersonalSchedule);
  }, [selectedSessions]);

  return (
    <div className="p-4 max-w-full mx-auto">
      <h1 className="text-2xl font-bold mb-4">Conference Schedule</h1>
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Time</th>
              {rooms.map(room => (
                <th key={room} className="border p-2">{room}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {conferenceData.map((dayData: ConferenceDay, dayIndex: number) => (
              <React.Fragment key={dayIndex}>
                <tr>
                  <td colSpan={rooms.length + 1} className="border p-2 font-bold bg-gray-200">
                    {dayData.day}
                  </td>
                </tr>
                {dayData.timeSlots.map((slot: TimeSlot, slotIndex: number) => (
                  <tr key={slotIndex}>
                    <td className="border p-2">{slot.time}</td>
                    {rooms.map((room, roomIndex) => (
                      <td key={roomIndex} className="border p-2 align-top">
                        {'sessions' in slot ? (
                          <RadioGroup
                            onValueChange={(value) => handleSessionChange(dayData.day, slot.time, value)}
                            value={selectedSessions[dayData.day]?.[slot.time]}
                          >
                            {slot.sessions.filter(session => session.room === room).map((session, sessionIndex) => (
                              <div key={sessionIndex} className="mb-2">
                                <div className="flex items-start space-x-2">
                                  <RadioGroupItem 
                                    value={session.name} 
                                    id={`${dayData.day}-${slot.time}-${session.name}`}
                                    className="mt-1"
                                  />
                                  <div>
                                    <label htmlFor={`${dayData.day}-${slot.time}-${session.name}`} className="text-sm font-bold block">
                                      {session.name}: {session.title}
                                    </label>
                                    <ul className="list-disc pl-4 mt-1">
                                      {session.details.map((detail, index) => (
                                        <li key={index} className="text-xs">{detail}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </RadioGroup>
                        ) : 'event' in slot && slot.room === room ? (
                          <div className="text-sm font-bold">{slot.event}</div>
                        ) : null}
                      </td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <PersonalSchedule personalSchedule={personalSchedule} />
    </div>
  );
};

export default ConferenceScheduleSelector;