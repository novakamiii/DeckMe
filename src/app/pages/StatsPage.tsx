import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { getSubjectList, initializeDeckStats, getViewedTime, mockSubjects } from "../lib/mockData";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { FileX } from "lucide-react";

// Theme colors from design system
const THEME_COLORS = {
  brunswickGreen: '#344E41',  // --brunswick-green
  hunterGreen: '#3A5A40',     // --hunter-green
  fernGreen: '#588157',       // --fern-green
  sage: '#A3B18A',            // --sage
  timberwolf: '#DAD7CD',      // --timberwolf
  destructive: '#d4183d',     // --destructive
};

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
      <FileX className="size-12 mb-4 opacity-50" />
      <p className="text-lg font-medium">Nothing here yet :(</p>
      <p className="text-sm">Start studying to see your stats!</p>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div 
        className="rounded-lg p-3 shadow-lg border backdrop-blur-sm bg-opacity-90"
        style={{ 
          backgroundColor: THEME_COLORS.timberwolf,
          borderColor: THEME_COLORS.sage,
          color: THEME_COLORS.brunswickGreen
        }}
      >
        <p className="font-bold mb-2 border-b border-brunswickGreen/10 pb-1" style={{ color: THEME_COLORS.brunswickGreen }}>{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm font-semibold flex justify-between gap-8" style={{ color: entry.color }}>
            <span>{entry.name}:</span>
            <span>{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function StatsPage() {
  const subjects = getSubjectList();

  const performanceData = subjects.map((subject) => {
    const stats = initializeDeckStats(subject.id);
    return {
      name: subject.title,
      correct: stats.correct,
      wrong: stats.wrong,
    };
  });

  const timeData = subjects.map((subject) => {
    const time = getViewedTime(subject.id);
    return {
      name: subject.title,
      minutes: Math.floor(time / 60),
    };
  });

  const sortedTimeData = [...timeData]
    .filter((subject) => subject.minutes > 0)
    .sort((a, b) => b.minutes - a.minutes)
    .slice(0, 5);

  const getBarColor = (minutes: number, index: number, total: number): string => {
    const colors = [
      THEME_COLORS.sage,
      THEME_COLORS.fernGreen,
      THEME_COLORS.hunterGreen,
      THEME_COLORS.brunswickGreen,
    ];
    if (total === 1) return THEME_COLORS.fernGreen;
    const colorIndex = Math.min(Math.floor((index / (total - 1)) * colors.length), colors.length - 1);
    return colors[colorIndex];
  };

  const mostViewedSubject = timeData.reduce((max, curr) =>
    curr.minutes > max.minutes ? curr : max,
    timeData[0] || { name: 'None', minutes: 0 }
  );

  const subjectsWithStats = performanceData.filter(
    (subject) => subject.correct > 0 || subject.wrong > 0
  );

  const hasStatsData = subjectsWithStats.length > 0;

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="mb-6">Statistics</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Subject Performance (Correct vs Wrong)</CardTitle>
          </CardHeader>
          <CardContent>
            {hasStatsData ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={subjectsWithStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke={THEME_COLORS.sage} strokeOpacity={0.3} vertical={false} />
                  <XAxis dataKey="name" stroke={THEME_COLORS.brunswickGreen} tick={{ fill: THEME_COLORS.brunswickGreen, fontSize: 12 }} />
                  <YAxis stroke={THEME_COLORS.brunswickGreen} tick={{ fill: THEME_COLORS.brunswickGreen, fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: THEME_COLORS.sage, fillOpacity: 0.1 }} />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="correct" name="Correct" fill={THEME_COLORS.fernGreen} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="wrong" name="Wrong" fill={THEME_COLORS.destructive} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Studied Subjects (Minutes)</CardTitle>
          </CardHeader>
          <CardContent>
            {sortedTimeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sortedTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke={THEME_COLORS.sage} strokeOpacity={0.3} />
                <XAxis dataKey="name" stroke={THEME_COLORS.brunswickGreen} tick={{ fill: THEME_COLORS.brunswickGreen, fontSize: 12 }} />
                <YAxis stroke={THEME_COLORS.brunswickGreen} tick={{ fill: THEME_COLORS.brunswickGreen, fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: THEME_COLORS.sage, fillOpacity: 0.3 }} />
                <Legend wrapperStyle={{ color: THEME_COLORS.brunswickGreen }} />
                <Bar dataKey="minutes" name="Study Time (minutes)" radius={[4, 4, 0, 0]}>
                  {sortedTimeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.minutes, index, sortedTimeData.length)} />
                  ))}
                </Bar>
              </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Time Spent per Subject</CardTitle>
          </CardHeader>
          <CardContent>
            {timeData.some((subject) => subject.minutes > 0) ? (
              <div className="space-y-4">
                {subjects.map((subject) => {
                  const time = getViewedTime(subject.id);
                  const hours = Math.floor(time / 3600);
                  const minutes = Math.floor((time % 3600) / 60);
                  const seconds = time % 60;

                  return (
                    <div key={subject.id} className="flex justify-between items-center">
                      <span>{subject.title}</span>
                      <span className="text-muted-foreground">
                        {hours > 0 && `${hours}h `}
                        {minutes > 0 && `${minutes}m `}
                        {seconds}s
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
