export default function StatCard({ number, label }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-center border">
      <div className="text-2xl font-bold text-indigo-600">{number}</div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
    </div>
  );
}
