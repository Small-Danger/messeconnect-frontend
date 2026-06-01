import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ChartPoint } from '../../services/mockAdminApi/data';
import { formatFcfa } from '../../utils/formatCurrency';

const COLORS = ['#534AB7', '#0F6E56', '#BA7517', '#26215C', '#1D9E75'];

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

function ChartCard({ title, children }: ChartCardProps) {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="h-56">{children}</div>
    </div>
  );
}

export function InscriptionsChart({ data }: { data: ChartPoint[] }) {
  return (
    <ChartCard title="Évolution des inscriptions">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EEEDFE" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#534AB7" strokeWidth={2} dot={{ fill: '#534AB7' }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function RevenusChart({ data }: { data: ChartPoint[] }) {
  return (
    <ChartCard title="Revenus mensuels (FCFA)">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EEEDFE" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
          <Tooltip formatter={(v) => formatFcfa(Number(v))} />
          <Bar dataKey="value" fill="#534AB7" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function DemandesChart({ data }: { data: ChartPoint[] }) {
  return (
    <ChartCard title="Répartition des demandes">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={80}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function ParoissesChart({ data }: { data: ChartPoint[] }) {
  return (
    <ChartCard title="Répartition des paroisses">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#EEEDFE" />
          <XAxis type="number" tick={{ fontSize: 12 }} />
          <YAxis dataKey="label" type="category" width={100} tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="value" fill="#0F6E56" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
