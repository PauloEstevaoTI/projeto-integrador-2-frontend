import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useAuth } from "../../context/authContext";

type PointRecord = {
  id: string;
  user_id: string;
  check_in: string;
  check_out: string | null;
  created_at?: string;
  updated_at?: string;
};

type GroupedRecords = {
  [date: string]: PointRecord[];
};

export function Relatorios() {
  const { user } = useAuth();
  const [records, setRecords] = useState<PointRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Inicializar com o mês atual
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  useEffect(() => {
    if (user?.id) {
      fetchRecords(selectedMonth, selectedYear);
    }
  }, [user?.id, selectedMonth, selectedYear]);

  const fetchRecords = async (month: number, year: number) => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Calcular primeiro e último dia do mês
      const firstDay = new Date(year, month - 1, 1);
      const lastDay = new Date(year, month, 0);
      
      const startDate = firstDay.toISOString().split('T')[0];
      const endDate = lastDay.toISOString().split('T')[0];

      const params = new URLSearchParams();
      params.append('start_date', startDate);
      params.append('end_date', endDate);

      const url = `/points/user/${user.id}?${params.toString()}`;
      const response = await api.get(url);
      setRecords(response.data);
    } catch (error: any) {
      console.error("Erro ao buscar registros:", error);
      alert(error.response?.data?.message || "Falha ao buscar registros.");
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const getMonthName = (month: number) => {
    const months = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    return months[month - 1];
  };

  const groupRecordsByDate = (): GroupedRecords => {
    const grouped = records.reduce((acc, record) => {
      // Usar check_in como referência de data, convertendo para fuso horário local
      const date = new Date(record.check_in).toLocaleDateString("pt-BR", {
        timeZone: "America/Sao_Paulo"
      });
      
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(record);
      return acc;
    }, {} as GroupedRecords);
    
    return grouped;
  };

  const formatTime = (datetime: string | null) => {
    if (!datetime) return "-";
    
    // Parse do datetime UTC e subtrai 3 horas manualmente
    const date = new Date(datetime);
    const offsetMinutes = date.getTimezoneOffset(); // Diferença em minutos do UTC
    const localDate = new Date(date.getTime() - (offsetMinutes * 60 * 1000));
    
    const hours = String(localDate.getHours()).padStart(2, "0");
    const minutes = String(localDate.getMinutes()).padStart(2, "0");
    
    return `${hours}:${minutes}`;
  };

  const calculateTotalHours = (checkIn: string, checkOut: string | null) => {
    if (!checkOut) return "-";
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getDaysInMonth = (groupedRecords: GroupedRecords) => {
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const days = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedYear, selectedMonth - 1, day);
      const dateString = date.toLocaleDateString("pt-BR");
      const dayRecords = groupedRecords[dateString] || [];
      
      days.push({
        day,
        dateString,
        records: dayRecords
      });
    }
    
    return days;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  const groupedRecords = groupRecordsByDate();
  const daysInMonth = getDaysInMonth(groupedRecords);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Relatórios de Ponto
        </h1>
        <p className="text-muted-foreground">
          Visualize o histórico de registros de ponto por mês
        </p>
      </div>

      {/* Seletor de Mês */}
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={handlePreviousMonth}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <svg
              className="w-6 h-6 text-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">
              {getMonthName(selectedMonth)} {selectedYear}
            </h2>
          </div>

          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <svg
              className="w-6 h-6 text-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Tabela do Mês */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left py-3 px-4 font-semibold text-foreground w-32">
                  Data
                </th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">
                  Entrada
                </th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">
                  Saída
                </th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">
                  Total de Horas
                </th>
                <th className="text-center py-3 px-4 font-semibold text-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {daysInMonth.map((dayInfo) => {
                const record = dayInfo.records[0]; // Pega o primeiro registro do dia
                const isWeekend = new Date(selectedYear, selectedMonth - 1, dayInfo.day).getDay() === 0 || 
                                  new Date(selectedYear, selectedMonth - 1, dayInfo.day).getDay() === 6;
                
                return (
                  <tr
                    key={dayInfo.day}
                    className={`border-b border-border hover:bg-secondary/30 transition-colors ${
                      isWeekend ? 'bg-secondary/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4 text-foreground font-medium">
                      {dayInfo.dateString}
                    </td>
                    <td className="py-3 px-4 text-foreground">
                      {record ? formatTime(record.check_in) : "-"}
                    </td>
                    <td className="py-3 px-4 text-foreground">
                      {record ? formatTime(record.check_out) : "-"}
                    </td>
                    <td className="py-3 px-4 text-foreground">
                      {record
                        ? calculateTotalHours(record.check_in, record.check_out)
                        : "-"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {record ? (
                        record.check_out ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Completo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium">
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Em Aberto
                          </span>
                        )
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-sm font-medium">
                          Sem registro
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
