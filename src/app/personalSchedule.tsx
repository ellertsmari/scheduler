import React from 'react';
import type { PersonalScheduleItem } from './data';

type Props = {
  personalSchedule: PersonalScheduleItem[];
};

const PersonalSchedule: React.FC<Props> = ({ personalSchedule }) => {
  const groupedSchedule: { [key: string]: PersonalScheduleItem[] } = personalSchedule.reduce((acc, item) => {
    if (!acc[item.day]) {
      acc[item.day] = [];
    }
    acc[item.day].push(item);
    return acc;
  }, {} as { [key: string]: PersonalScheduleItem[] });

  const dayColors: { [key: string]: string } = {
    "Monday July 8th": "bg-blue-50 border-blue-200",
    "Tuesday July 9th": "bg-green-50 border-green-200",
    "Wednesday July 10th": "bg-purple-50 border-purple-200",
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <h2 className="text-2xl font-bold p-4 bg-gray-100">Your Personal Schedule</h2>
      <div className="flex flex-col lg:flex-row">
        {Object.entries(groupedSchedule).map(([day, items]) => (
          <div key={day} className={`flex-1 ${dayColors[day] || 'bg-gray-50 border-gray-200'} border-t lg:border-t-0 lg:border-l`}>
            <h3 className="text-xl font-semibold p-3 bg-opacity-50 border-b border-gray-200">{day}</h3>
            <div className="p-4 space-y-4 h-full overflow-y-auto" style={{maxHeight: '600px'}}>
              {items.map((item, index) => (
                <div key={index} className="bg-white rounded-md shadow-sm p-4 transition duration-300 ease-in-out hover:shadow-md">
                  <p className="font-bold text-lg mb-2">{item.time}</p>
                  {item.session ? (
                    <>
                      <p className="text-lg font-medium text-indigo-700 mb-1">{item.session.name}: {item.session.title}</p>
                      <p className="text-sm text-gray-600 mb-2">Room: {item.session.room}</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        {item.session.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="text-sm text-gray-700">{detail}</li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p className="text-lg text-gray-700">{item.event} - Room: {item.room}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalSchedule;