import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useAuth } from "../../context/authContext";

type RecordItem = {
  id: number;
  type: "entrada" | "saida";
  time: string;
  timestamp: number;
};

export function Pontos() {
  const { user } = useAuth();
  //const USER_ID = "5bcf49b7-b445-4f5e-9219-0be463362bea";
  const [currentTime, setCurrentTime] = useState(new Date());
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [inputHour, setInputHour] = useState("");
  const [inputMinute, setInputMinute] = useState("");
  const [recordType, setRecordType] = useState<"entrada" | "saida">("entrada");
  const [isClocked, setIsClocked] = useState(false);

  // Carregar dados do localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem(`timeclock-${today}`);
    if (stored) {
      const parsed = JSON.parse(stored) as RecordItem[];
      setRecords(parsed);
      const lastRecord = parsed[parsed.length - 1];
      setIsClocked(lastRecord?.type === "entrada");
    }
  }, []);

  // Atualizar relógio
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const saveRecords = (newRecords: RecordItem[]) => {
    const today = new Date().toDateString();
    localStorage.setItem(`timeclock-${today}`, JSON.stringify(newRecords));
  };

  // const addRecord = async (type: "entrada" | "saida") => {
  //   try {
  //     // Define o endpoint correto baseado no tipo
  //     // const endpoint =
  //     //   type === "entrada" ? "/points/checkin" : "/points/checkout";

  //     // Chama o backend passando user_id como query parameter
  //     //await api.post(`${endpoint}?user_id=${USER_ID}`);
  //     // await api.post(endpoint, null, {
  //     //   params: { user_id: user?.id },
  //     // });
  //     await api.post("/points/checkout", null, {
  //       params: { user_id: user?.id },
  //     });
  //     // Atualiza o registro local
  //     const now = new Date();
  //     const record: RecordItem = {
  //       id: Date.now(),
  //       type,
  //       time: `${String(now.getHours()).padStart(2, "0")}:${String(
  //         now.getMinutes()
  //       ).padStart(2, "0")}`,
  //       timestamp: now.getTime(),
  //     };

  //     const updated = [...records, record];
  //     setRecords(updated);
  //     saveRecords(updated);

  //     // Atualiza estado de clock
  //     setIsClocked(type === "entrada");
  //   } catch (err: any) {
  //     alert(err.response?.data?.detail || "Erro ao registrar ponto");
  //   }
  // };

  const checkIn = async () => {
    try {
      await api.post("/points/checkin", null, {
        params: { user_id: user?.id },
      });

      const now = new Date();
      const record: RecordItem = {
        id: Date.now(),
        type: "entrada",
        time: `${String(now.getHours()).padStart(2, "0")}:${String(
          now.getMinutes()
        ).padStart(2, "0")}`,
        timestamp: now.getTime(),
      };

      const updated = [...records, record];
      setRecords(updated);
      saveRecords(updated);
      setIsClocked(true);
      alert(`✅ Entrada registrada às ${record.time}`);
    } catch (err: any) {
      alert(err.response?.data?.detail || "Erro ao registrar entrada");
    }
  };

  // Função para registrar saída
  const checkOut = async () => {
    try {
      await api.post("/points/checkout", null, {
        params: { user_id: user?.id },
      });

      const now = new Date();
      const record: RecordItem = {
        id: Date.now(),
        type: "saida",
        time: `${String(now.getHours()).padStart(2, "0")}:${String(
          now.getMinutes()
        ).padStart(2, "0")}`,
        timestamp: now.getTime(),
      };

      const updated = [...records, record];
      setRecords(updated);
      saveRecords(updated);
      setIsClocked(false);
      alert(`✅ Saída registrada às ${record.time}`);
    } catch (err: any) {
      alert(err.response?.data?.detail || "Erro ao registrar saída");
    }
  };

  const addCustomRecord = () => {
    if (!inputHour || !inputMinute) return;
    const record: RecordItem = {
      id: Date.now(),
      type: recordType,
      time: `${String(inputHour).padStart(2, "0")}:${String(
        inputMinute
      ).padStart(2, "0")}`,
      timestamp:
        Number.parseInt(inputHour) * 3600 + Number.parseInt(inputMinute) * 60,
    };
    const updated = [...records, record];
    setRecords(updated);
    saveRecords(updated);
    setShowModal(false);
    setInputHour("");
    setInputMinute("");
    setIsClocked(recordType === "entrada");
  };

  const deleteRecord = (id: number) => {
    const updated = records.filter((r) => r.id !== id);
    setRecords(updated);
    saveRecords(updated);
    if (updated.length > 0) {
      const lastRecord = updated[updated.length - 1];
      setIsClocked(lastRecord.type === "entrada");
    } else {
      setIsClocked(false);
    }
  };

  const calculateHours = () => {
    let totalSeconds = 0;
    for (let i = 0; i < records.length - 1; i++) {
      const current = records[i];
      const next = records[i + 1];

      if (current.type === "entrada" && next.type === "saida") {
        const [currentHour, currentMin] = current.time.split(":").map(Number);
        const [nextHour, nextMin] = next.time.split(":").map(Number);

        const currentSeconds = currentHour * 3600 + currentMin * 60;
        const nextSeconds = nextHour * 3600 + nextMin * 60;

        totalSeconds += nextSeconds - currentSeconds;
        i++;
      }
    }
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Controle de Ponto {user?.id}
          </h1>
          <p className="text-gray-600 mt-2">
            {new Date().toLocaleDateString("pt-BR")}
          </p>
        </div>

        {/* Clock Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="text-center">
            <div className="text-6xl font-mono font-bold text-blue-600 mb-4">
              {String(currentTime.getHours()).padStart(2, "0")}:
              {String(currentTime.getMinutes()).padStart(2, "0")}:
              {String(currentTime.getSeconds()).padStart(2, "0")}
            </div>
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gray-100">
              <div
                className={`w-3 h-3 rounded-full ${
                  isClocked ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span className="text-gray-700 font-medium">
                {isClocked ? "Presente" : "Ausente"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <button
            onClick={checkIn}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition"
          >
            <span className="text-xl">↓</span> Entrada
          </button>

          <button
            onClick={() => {
              setRecordType("entrada");
              setShowModal(true);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            <span className="text-xl">✎</span> Editar
          </button>

          <button
            onClick={checkOut}
            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition"
          >
            <span className="text-xl">↑</span> Saída
          </button>
        </div>

        {/* Total Hours */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white mb-6">
          <p className="text-sm opacity-90">Horas Trabalhadas</p>
          <p className="text-4xl font-bold">{calculateHours()}</p>
        </div>

        {/* Records History */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h2 className="text-xl font-bold text-gray-900">
              Registros do Dia
            </h2>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {records.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <p>Nenhum registro ainda</p>
              </div>
            ) : (
              <div className="divide-y">
                {records.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          record.type === "entrada"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {record.type === "entrada" ? "Entrada" : "Saída"}
                        </p>
                        <p className="text-2xl font-mono text-gray-700">
                          {record.time}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteRecord(record.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded transition font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Adicionar Registro Manual
              </h3>

              {/* Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Tipo
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setRecordType("entrada")}
                    className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
                      recordType === "entrada"
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Entrada
                  </button>
                  <button
                    onClick={() => setRecordType("saida")}
                    className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
                      recordType === "saida"
                        ? "bg-red-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Saída
                  </button>
                </div>
              </div>

              {/* Time Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Horário
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={inputHour}
                    onChange={(e) => setInputHour(e.target.value)}
                    placeholder="HH"
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center text-xl font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-3xl font-bold text-gray-400">:</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={inputMinute}
                    onChange={(e) => setInputMinute(e.target.value)}
                    placeholder="MM"
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center text-xl font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 px-4 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={addCustomRecord}
                  className="flex-1 py-2 px-4 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
