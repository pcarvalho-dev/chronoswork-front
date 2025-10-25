'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { api, TimeLog } from '../lib/api';
import InteractiveBackground from '../components/InteractiveBackground';
import CameraCapture from '../components/CameraCapture';
import PhotoViewer, { PhotoData } from '../components/PhotoViewer';
import { useAuth } from '../contexts/AuthContext';

const inspirationalQuotes = [
  { text: "O tempo é o que mais desejamos e o que pior usamos.", author: "William Penn" },
  { text: "O tempo é a moeda da sua vida. É a única que você possui e só você pode determinar como será gasta.", author: "Carl Sandburg" },
  { text: "O segredo de você realizar algo está em começar.", author: "Mark Twain" },
  { text: "A disciplina é a ponte entre metas e realizações.", author: "Jim Rohn" },
  { text: "Você não pode controlar o tempo, mas pode controlar como o usa.", author: "Brian Tracy" },
  { text: "O único modo de fazer um excelente trabalho é amar o que você faz.", author: "Steve Jobs" },
  { text: "O sucesso é a soma de pequenos esforços repetidos dia após dia.", author: "Robert Collier" },
  { text: "Não conte os dias, faça os dias contarem.", author: "Muhammad Ali" },
  { text: "O tempo perdido nunca mais é encontrado.", author: "Benjamin Franklin" },
  { text: "A produtividade não é uma questão de tempo, é uma questão de foco.", author: "Tim Ferriss" },
  { text: "Comece de onde você está. Use o que você tem. Faça o que você pode.", author: "Arthur Ashe" },
  { text: "O melhor momento para plantar uma árvore foi há 20 anos. O segundo melhor momento é agora.", author: "Provérbio Chinês" },
  { text: "A persistência é o caminho do êxito.", author: "Charles Chaplin" },
  { text: "O único limite para nossa realização de amanhã são nossas dúvidas de hoje.", author: "Franklin D. Roosevelt" },
  { text: "Concentre-se em ser produtivo ao invés de ocupado.", author: "Tim Ferriss" },
  { text: "A vida é 10% o que acontece com você e 90% como você reage a isso.", author: "Charles R. Swindoll" },
  { text: "O futuro pertence àqueles que acreditam na beleza de seus sonhos.", author: "Eleanor Roosevelt" },
  { text: "Não espere por oportunidades extraordinárias. Agarre ocasiões comuns e as torne grandes.", author: "Orison Swett Marden" },
  { text: "A única maneira de fazer um ótimo trabalho é amar o que você faz.", author: "Steve Jobs" },
  { text: "O sucesso não é final, o fracasso não é fatal: é a coragem de continuar que conta.", author: "Winston Churchill" },
  { text: "Acredite que você pode e você já está no meio do caminho.", author: "Theodore Roosevelt" },
  { text: "A melhor vingança é o sucesso massivo.", author: "Frank Sinatra" },
  { text: "Não há atalhos para qualquer lugar que valha a pena ir.", author: "Beverly Sills" },
  { text: "O pessimista vê dificuldade em cada oportunidade. O otimista vê oportunidade em cada dificuldade.", author: "Winston Churchill" },
  { text: "Você perde 100% das chances que não arrisca.", author: "Wayne Gretzky" },
  { text: "A ação é a chave fundamental para todo sucesso.", author: "Pablo Picasso" },
  { text: "O que nos parece uma provação amarga pode ser uma bênção disfarçada.", author: "Oscar Wilde" },
  { text: "A diferença entre ganhar e perder é, na maioria das vezes, não desistir.", author: "Walt Disney" },
  { text: "O sucesso geralmente vem para aqueles que estão ocupados demais para procurá-lo.", author: "Henry David Thoreau" },
  { text: "Oportunidades não acontecem. Você as cria.", author: "Chris Grosser" },
  { text: "Não tenha medo de desistir do bom para perseguir o ótimo.", author: "John D. Rockefeller" },
  { text: "Faça o que você pode, com o que você tem, onde você está.", author: "Theodore Roosevelt" },
  { text: "Se você não pode voar, corra. Se você não pode correr, caminhe. Se você não pode caminhar, rasteje, mas continue se movendo.", author: "Martin Luther King Jr." },
  { text: "Nossa maior glória não está em nunca cair, mas em levantar toda vez que caímos.", author: "Confúcio" },
  { text: "Tudo o que você sempre quis está do outro lado do medo.", author: "George Addair" },
  { text: "O sucesso é ir de fracasso em fracasso sem perder o entusiasmo.", author: "Winston Churchill" },
  { text: "Sonhe grande e ouse falhar.", author: "Norman Vaughan" },
  { text: "A melhor preparação para amanhã é fazer o seu melhor hoje.", author: "H. Jackson Brown Jr." },
  { text: "Você não precisa ser grande para começar, mas precisa começar para ser grande.", author: "Zig Ziglar" },
  { text: "A única coisa impossível é aquilo que você não tenta.", author: "Desconhecido" },
  { text: "Um objetivo sem um plano é apenas um desejo.", author: "Antoine de Saint-Exupéry" },
  { text: "A única forma de alcançar o impossível é acreditar que é possível.", author: "Charles Kingsleigh" },
  { text: "Não conte as horas, faça as horas contarem.", author: "Muhammad Ali" },
  { text: "A vida é muito curta para ser pequena.", author: "Benjamin Disraeli" },
  { text: "Seja a mudança que você deseja ver no mundo.", author: "Mahatma Gandhi" },
  { text: "A perfeição não é alcançável, mas se perseguirmos a perfeição, podemos alcançar a excelência.", author: "Vince Lombardi" },
  { text: "A motivação é o que te faz começar. O hábito é o que te mantém.", author: "Jim Ryun" },
  { text: "Você deve fazer as coisas que acha que não pode fazer.", author: "Eleanor Roosevelt" },
  { text: "O caminho para o sucesso e o caminho para o fracasso são quase exatamente os mesmos.", author: "Colin R. Davis" },
  { text: "Faça hoje o que os outros não farão, para que amanhã você possa fazer o que os outros não podem.", author: "Jerry Rice" },
  { text: "A genialidade é 1% inspiração e 99% transpiração.", author: "Thomas Edison" },
  { text: "Você tem que aprender as regras do jogo. E então você tem que jogar melhor do que qualquer um.", author: "Albert Einstein" },
  { text: "Coragem não é a ausência de medo, mas a capacidade de agir apesar dele.", author: "Mark Twain" },
  { text: "A melhor maneira de prever o futuro é criá-lo.", author: "Peter Drucker" },
  { text: "Não deixe o que você não pode fazer interferir no que você pode fazer.", author: "John Wooden" },
  { text: "A única pessoa que você está destinado a se tornar é a pessoa que você decide ser.", author: "Ralph Waldo Emerson" },
  { text: "Lembre-se de que não conseguir o que você quer às vezes é um golpe de sorte maravilhoso.", author: "Dalai Lama" },
  { text: "Sonhe grande, comece pequeno, mas acima de tudo, comece.", author: "Simon Sinek" },
  { text: "Não assista ao relógio; faça o que ele faz. Continue em movimento.", author: "Sam Levenson" },
  { text: "A excelência não é um destino; é uma jornada contínua que nunca termina.", author: "Brian Tracy" },
  { text: "O insucesso é apenas a oportunidade de começar de novo de forma mais inteligente.", author: "Henry Ford" },
  { text: "Se você quer ir rápido, vá sozinho. Se quer ir longe, vá acompanhado.", author: "Provérbio Africano" },
  { text: "A única limitação para nossas realizações de amanhã são nossas dúvidas de hoje.", author: "Franklin D. Roosevelt" },
  { text: "O segredo para ir adiante é começar.", author: "Mark Twain" },
  { text: "Grandes coisas nos negócios nunca são feitas por uma pessoa. São feitas por uma equipe de pessoas.", author: "Steve Jobs" }
];

export default function DashboardPage() {
  const { user, logout, refreshUserProfile, loading: authLoading } = useAuth();
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentSession, setCurrentSession] = useState<TimeLog | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [dailyQuote, setDailyQuote] = useState(inspirationalQuotes[0]);
  const [isClient, setIsClient] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [weather, setWeather] = useState<{ temp: number; description: string; icon: string } | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraAction, setCameraAction] = useState<'checkin' | 'checkout' | null>(null);
  const [photoViewerPhotos, setPhotoViewerPhotos] = useState<PhotoData[]>([]);
  const [photoViewerInitialIndex, setPhotoViewerInitialIndex] = useState<number>(0);

  // Helper function to build correct photo URLs (handles both local and Cloudinary URLs)
  const getPhotoUrl = (photoPath: string | null | undefined): string | null => {
    if (!photoPath) return null;
    // If it's already a full URL (Cloudinary), return as is
    if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
      return photoPath;
    }
    // Otherwise, it's a local path, prepend the API URL
    return `http://localhost:8000${photoPath}`;
  };

  useEffect(() => {
    setIsClient(true);
    setDailyQuote(inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)]);
    fetchTimeLogs();
    fetchWeather();

    // Atualiza o horário a cada segundo
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
    }, 1000);

    // Atualiza as estatísticas a cada 1 minuto
    const statsInterval = setInterval(() => {
      fetchTimeLogs();
    }, 60000); // 60000ms = 1 minuto

    return () => {
      clearInterval(timeInterval);
      clearInterval(statsInterval);
    };
  }, []);

  const fetchWeather = async () => {
    try {
      // Tenta obter localização do usuário
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

            if (!apiKey || apiKey === 'demo') {
              console.warn('API key do OpenWeatherMap não configurada');
              setWeatherLoading(false);
              return;
            }

            try {
              const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=pt_br&appid=${apiKey}`
              );

              if (response.ok) {
                const data = await response.json();
                setWeather({
                  temp: Math.round(data.main.temp),
                  description: data.weather[0].description,
                  icon: data.weather[0].icon
                });
              } else if (response.status === 401) {
                console.warn('API key inválida ou ainda não ativada. Aguarde alguns minutos e recarregue a página.');
              } else {
                console.error('Erro ao buscar clima:', response.status);
              }
            } catch (fetchError) {
              console.error('Erro na requisição do clima:', fetchError);
            }
            setWeatherLoading(false);
          },
          (error) => {
            console.warn('Geolocalização não permitida:', error);
            setWeatherLoading(false);
          }
        );
      } else {
        setWeatherLoading(false);
      }
    } catch (err) {
      console.error('Erro ao buscar clima:', err);
      setWeatherLoading(false);
    }
  };

  const fetchTimeLogs = async () => {
    try {
      const logs = await api.getTimeLogs();
      setTimeLogs(logs);

      // Verifica se há uma sessão ativa (sem horário de saída)
      const activeSession = logs.find(log => !log.checkOut);
      setCurrentSession(activeSession || null);

      setError('');
    } catch (err: any) {
      setError(err.message || 'Falha ao buscar registros de tempo');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckInClick = () => {
    setCameraAction('checkin');
    setShowCamera(true);
  };

  const handleCheckOutClick = () => {
    setCameraAction('checkout');
    setShowCamera(true);
  };

  const handlePhotoCapture = async (photo: File) => {
    setShowCamera(false);
    setActionLoading(true);
    setError('');

    try {
      // Captura a geolocalização
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocalização não suportada pelo navegador'));
          return;
        }

        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;

      console.log('Geolocalização capturada:', { latitude, longitude, action: cameraAction });

      if (cameraAction === 'checkin') {
        await api.checkIn(photo, latitude, longitude);
      } else if (cameraAction === 'checkout') {
        await api.checkOut(photo, latitude, longitude);
      }
      await fetchTimeLogs();
    } catch (err: any) {
      const errorMessage = err.message || `Falha ao registrar ${cameraAction === 'checkin' ? 'entrada' : 'saída'}`;
      setError(errorMessage);
      console.error('Erro ao capturar localização ou registrar ponto:', err);
    } finally {
      setActionLoading(false);
      setCameraAction(null);
    }
  };

  const handleCameraCancel = () => {
    setShowCamera(false);
    setCameraAction(null);
  };

  const handleViewPhoto = (log: TimeLog, photoType: 'checkin' | 'checkout') => {
    const photos: PhotoData[] = [];

    // Add check-in photo if exists
    if (log.checkInPhoto) {
      const checkInUrl = getPhotoUrl(log.checkInPhoto);
      if (checkInUrl) {
        photos.push({
          url: checkInUrl,
          title: 'Foto de Entrada',
          timestamp: log.checkIn,
          type: 'checkin'
        });
      }
    }

    // Add check-out photo if exists
    if (log.checkOutPhoto) {
      const checkOutUrl = getPhotoUrl(log.checkOutPhoto);
      if (checkOutUrl) {
        photos.push({
          url: checkOutUrl,
          title: 'Foto de Saída',
          timestamp: log.checkOut!,
          type: 'checkout'
        });
      }
    }

    // Determine initial index based on which photo was clicked
    const initialIndex = photoType === 'checkin' ? 0 : photos.length - 1;

    setPhotoViewerPhotos(photos);
    setPhotoViewerInitialIndex(initialIndex);
  };

  const handleClosePhotoViewer = () => {
    setPhotoViewerPhotos([]);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateDuration = (checkIn: string, checkOut: string | null) => {
    const start = new Date(checkIn).getTime();
    const end = checkOut ? new Date(checkOut).getTime() : Date.now();
    const durationMs = end - start;

    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  const calculateDurationInMs = (checkIn: string, checkOut: string | null) => {
    const start = new Date(checkIn).getTime();
    const end = checkOut ? new Date(checkOut).getTime() : Date.now();
    return end - start;
  };

  // Calcula o último ponto registrado
  const getLastCheckpoint = () => {
    if (timeLogs.length === 0) return null;
    const lastLog = timeLogs[0];
    return lastLog.checkOut || lastLog.checkIn;
  };

  // Calcula tempo desde o último ponto
  const getTimeSinceLastCheckpoint = () => {
    const lastCheckpoint = getLastCheckpoint();
    if (!lastCheckpoint) return '0h 0m';
    return calculateDuration(lastCheckpoint, null);
  };

  // Calcula total de horas trabalhadas no dia (hoje)
  const getTodayWorkedHours = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayLogs = timeLogs.filter(log => {
      const logDate = new Date(log.checkIn);
      logDate.setHours(0, 0, 0, 0);
      return logDate.getTime() === today.getTime();
    });

    // Conta apenas sessões completas
    const completedLogs = todayLogs.filter(log => log.checkOut !== null);

    const totalMs = completedLogs.reduce((total, log) => {
      return total + calculateDurationInMs(log.checkIn, log.checkOut);
    }, 0);

    const hours = Math.floor(totalMs / (1000 * 60 * 60));
    const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  // Calcula o tempo de intervalo do dia (hoje)
  const getTodayBreakTime = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayLogs = timeLogs.filter(log => {
      const logDate = new Date(log.checkIn);
      logDate.setHours(0, 0, 0, 0);
      return logDate.getTime() === today.getTime();
    }).sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime());

    const completedLogs = todayLogs.filter(log => log.checkOut !== null);

    // Se tem menos de 2 sessões completas, retorna intervalo previsto
    if (completedLogs.length < 2) {
      return {
        time: '1h 0m',
        isPredicted: true
      };
    }

    // Calcula intervalos entre checkout e próximo checkin
    let totalBreakMs = 0;
    for (let i = 0; i < completedLogs.length - 1; i++) {
      const checkoutTime = new Date(completedLogs[i].checkOut!).getTime();
      const nextCheckinTime = new Date(completedLogs[i + 1].checkIn).getTime();
      totalBreakMs += nextCheckinTime - checkoutTime;
    }

    const hours = Math.floor(totalBreakMs / (1000 * 60 * 60));
    const minutes = Math.floor((totalBreakMs % (1000 * 60 * 60)) / (1000 * 60));
    return {
      time: `${hours}h ${minutes}m`,
      isPredicted: false
    };
  };

  // Calcula banco de horas
  const getTotalHoursBank = () => {
    // Filtra apenas logs completos (com checkout)
    const completedLogs = timeLogs.filter(log => log.checkOut !== null);

    if (completedLogs.length === 0) return '0h 0m';

    // Agrupa logs por dia
    const logsByDay = completedLogs.reduce((acc, log) => {
      const date = new Date(log.checkIn);
      date.setHours(0, 0, 0, 0);
      const dateKey = date.getTime();

      if (!acc[dateKey]) {
        acc[dateKey] = { date, logs: [] };
      }
      acc[dateKey].logs.push(log);
      return acc;
    }, {} as Record<number, { date: Date; logs: TimeLog[] }>);

    // Encontra o primeiro dia do mês do primeiro registro
    const firstLogDate = new Date(completedLogs[completedLogs.length - 1].checkIn);
    const firstDayOfMonth = new Date(firstLogDate.getFullYear(), firstLogDate.getMonth(), 1);
    firstDayOfMonth.setHours(0, 0, 0, 0);

    // Conta dias úteis desde o primeiro dia do mês até hoje
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let workDaysCount = 0;
    const currentDate = new Date(firstDayOfMonth);

    while (currentDate <= today) {
      const dayOfWeek = currentDate.getDay();
      // 0 = Domingo, 6 = Sábado
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        workDaysCount++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Calcula horas esperadas (8h por dia útil)
    const expectedMs = workDaysCount * 8 * 60 * 60 * 1000;

    // Calcula horas trabalhadas (soma apenas o tempo das sessões completas)
    let workedMs = 0;
    Object.values(logsByDay).forEach(({ date, logs }) => {
      const dayOfWeek = date.getDay();
      // Ignora finais de semana
      if (dayOfWeek === 0 || dayOfWeek === 6) return;

      // Ordena logs do dia por horário de check-in
      const sortedLogs = logs.sort((a, b) =>
        new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime()
      );

      // Soma apenas o tempo dentro das sessões (intervalos não contam)
      const dayMs = sortedLogs.reduce((total, log) => {
        return total + calculateDurationInMs(log.checkIn, log.checkOut);
      }, 0);

      workedMs += dayMs;
    });

    // Banco de horas = trabalhado - esperado
    const bankMs = workedMs - expectedMs;

    const isPositive = bankMs >= 0;
    const absBankMs = Math.abs(bankMs);
    const hours = Math.floor(absBankMs / (1000 * 60 * 60));
    const minutes = Math.floor((absBankMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${isPositive ? '+' : '-'}${hours}h ${minutes}m`;
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione uma imagem válida');
      return;
    }

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 5MB');
      return;
    }

    setUploadingPhoto(true);
    setError('');

    try {
      await api.uploadPhoto(file);
      await refreshUserProfile();
      setShowProfileMenu(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer upload da foto';
      setError(errorMessage);
      console.error('Erro no upload:', err);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Erro no logout:', err);
    }
  };

  return (
    <div className="min-h-screen relative">
      <InteractiveBackground />

      {/* Header */}
      <nav className="bg-white/70 backdrop-blur-lg border-b border-white/30 sticky top-0 z-50">
        <div className="container-custom">
          <div className="flex items-center justify-between h-navbar">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Chronos.work"
                width={1200}
                height={320}
                className="h-60 w-auto drop-shadow-lg"
              />
            </div>

            <div className="flex items-center gap-4">
              {/* Profile Avatar */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/50 hover:border-primary-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  {user?.profilePhoto ? (
                    <img src={getPhotoUrl(user.profilePhoto) || ''} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>

                {/* Profile Menu Dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 glass-container p-4 shadow-xl">
                    <div className="space-y-3">
                      <label className="block">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          disabled={uploadingPhoto}
                          className="hidden"
                        />
                        <div className="btn-ghost w-full cursor-pointer text-sm">
                          {uploadingPhoto ? (
                            <span className="flex items-center gap-2">
                              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Enviando...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {user?.profilePhoto ? 'Alterar foto' : 'Adicionar foto'}
                            </span>
                          )}
                        </div>
                      </label>

                      <div className="border-t border-warmGrey-200 pt-3">
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            handleLogout();
                          }}
                          className="btn-ghost w-full text-sm"
                        >
                          <span className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sair
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container-custom py-12 relative z-10">
        <h1 className="text-5xl font-bold mb-2">
          <span className="gradient-text">Painel</span>
        </h1>
        <p className="text-warmGrey-700 font-medium mb-8">Gerencie seu tempo de trabalho</p>

        {error && (
          <div className="bg-red-500/10 backdrop-blur-md border border-red-500/30 text-red-700 px-4 py-3 rounded-xl mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Check In/Out Card */}
          <div className="lg:col-span-2 glass-container p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-warmGrey-900">Controle de Tempo</h2>
                <p className="text-warmGrey-600 text-sm">Registre suas horas de trabalho</p>
              </div>
            </div>

            {currentSession ? (
              <div className="space-y-6">
                <div className="bg-green-500/10 backdrop-blur-sm border border-green-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-3 text-green-700 mb-3">
                    <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse" />
                    <span className="font-bold text-lg">Sessão Ativa</span>
                  </div>
                  <div className="space-y-2 text-warmGrey-700">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm">Iniciado em:</span>
                      <span className="font-semibold">{formatDate(currentSession.checkIn)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <span className="text-sm">Duração:</span>
                      <span className="font-semibold text-lg gradient-text">{calculateDuration(currentSession.checkIn, null)}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleCheckOutClick}
                  disabled={actionLoading}
                  className="btn-secondary w-full text-lg py-4"
                >
                  {actionLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Registrando saída...
                    </span>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Registrar Saída
                    </>
                  )}
                </button>

                {/* Inspirational Quote */}
                <div className="bg-gradient-to-br from-primary-50/50 to-purple-50/50 backdrop-blur-sm border border-primary-200/30 rounded-xl p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <svg className="w-8 h-8 text-primary-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-warmGrey-700 text-base leading-relaxed italic mb-3">
                        "{dailyQuote.text}"
                      </p>
                      <p className="text-warmGrey-600 text-sm font-medium">
                        — {dailyQuote.author}
                      </p>
                    </div>
                  </div>

                  {/* Time and Weather */}
                  <div className="flex items-center justify-between pt-4 border-t border-primary-200/30">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-warmGrey-700 font-semibold text-lg">
                        {currentTime || '--:--:--'}
                      </span>
                    </div>

                    {weatherLoading ? (
                      <div className="flex items-center gap-2 text-warmGrey-500">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span className="text-sm">Carregando...</span>
                      </div>
                    ) : weather ? (
                      <div className="flex items-center gap-2">
                        <img
                          src={`https://openweathermap.org/img/wn/${weather.icon}.png`}
                          alt={weather.description}
                          className="w-8 h-8"
                        />
                        <div className="text-right">
                          <p className="text-warmGrey-700 font-semibold text-lg">{weather.temp}°C</p>
                          <p className="text-warmGrey-600 text-xs capitalize">{weather.description}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-warmGrey-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                        </svg>
                        <span className="text-sm">Clima indisponível</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-warmGrey-100/50 backdrop-blur-sm border border-warmGrey-200/50 rounded-xl p-6 text-center">
                  <svg className="w-16 h-16 mx-auto mb-4 text-warmGrey-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-warmGrey-700 font-medium">Nenhuma sessão ativa</p>
                  <p className="text-warmGrey-600 text-sm mt-1">Clique no botão abaixo para começar a rastrear seu tempo</p>
                </div>
                <button
                  onClick={handleCheckInClick}
                  disabled={actionLoading}
                  className="btn-primary w-full text-lg py-4"
                >
                  {actionLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Registrando entrada...
                    </span>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Registrar Entrada
                    </>
                  )}
                </button>

                {/* Inspirational Quote */}
                <div className="bg-gradient-to-br from-primary-50/50 to-purple-50/50 backdrop-blur-sm border border-primary-200/30 rounded-xl p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <svg className="w-8 h-8 text-primary-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-warmGrey-700 text-base leading-relaxed italic mb-3">
                        "{dailyQuote.text}"
                      </p>
                      <p className="text-warmGrey-600 text-sm font-medium">
                        — {dailyQuote.author}
                      </p>
                    </div>
                  </div>

                  {/* Time and Weather */}
                  <div className="flex items-center justify-between pt-4 border-t border-primary-200/30">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-warmGrey-700 font-semibold text-lg">
                        {currentTime || '--:--:--'}
                      </span>
                    </div>

                    {weatherLoading ? (
                      <div className="flex items-center gap-2 text-warmGrey-500">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span className="text-sm">Carregando...</span>
                      </div>
                    ) : weather ? (
                      <div className="flex items-center gap-2">
                        <img
                          src={`https://openweathermap.org/img/wn/${weather.icon}.png`}
                          alt={weather.description}
                          className="w-8 h-8"
                        />
                        <div className="text-right">
                          <p className="text-warmGrey-700 font-semibold text-lg">{weather.temp}°C</p>
                          <p className="text-warmGrey-600 text-xs capitalize">{weather.description}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-warmGrey-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                        </svg>
                        <span className="text-sm">Clima indisponível</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stats Card */}
          <div className="glass-container p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-warmGrey-900">Estatísticas</h3>
                <p className="text-warmGrey-600 text-xs">Resumo geral</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white/40 backdrop-blur-sm border border-white/30 rounded-xl p-4">
                <p className="text-warmGrey-600 text-sm mb-1">Último Ponto</p>
                <p className="text-lg font-bold text-warmGrey-900">
                  {getLastCheckpoint() ? formatDate(getLastCheckpoint()!) : '-'}
                </p>
              </div>

              <div className="bg-white/40 backdrop-blur-sm border border-white/30 rounded-xl p-4">
                <p className="text-warmGrey-600 text-sm mb-1">Tempo desde último ponto</p>
                <p className="text-2xl font-bold gradient-text">
                  {getTimeSinceLastCheckpoint()}
                </p>
              </div>

              <div className="bg-white/40 backdrop-blur-sm border border-white/30 rounded-xl p-4">
                <p className="text-warmGrey-600 text-sm mb-1">Horas trabalhadas hoje</p>
                <p className="text-2xl font-bold text-warmGrey-900">
                  {getTodayWorkedHours()}
                </p>
              </div>

              <div className="bg-white/40 backdrop-blur-sm border border-white/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-warmGrey-600 text-sm">Intervalo do Dia</p>
                  {getTodayBreakTime().isPredicted && (
                    <span className="text-xs text-warmGrey-500 bg-warmGrey-200/50 px-2 py-0.5 rounded-full">
                      Previsto
                    </span>
                  )}
                </div>
                <p className={`text-2xl font-bold ${getTodayBreakTime().isPredicted ? 'text-warmGrey-500' : 'text-orange-600'}`}>
                  {getTodayBreakTime().time}
                </p>
              </div>

              <div className="bg-white/40 backdrop-blur-sm border border-white/30 rounded-xl p-4">
                <p className="text-warmGrey-600 text-sm mb-1">Banco de Horas Total</p>
                <p className="text-2xl font-bold gradient-text">
                  {getTotalHoursBank()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Time Logs */}
        <div className="glass-container p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-warmGrey-900">Histórico de Registros</h2>
              <p className="text-warmGrey-600 text-sm">Todas as suas sessões de trabalho</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <svg className="animate-spin h-12 w-12 mx-auto text-primary-600 mb-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-warmGrey-600 font-medium">Carregando...</p>
            </div>
          ) : timeLogs.length === 0 ? (
            <div className="text-center py-12 bg-warmGrey-100/50 backdrop-blur-sm border border-warmGrey-200/50 rounded-xl">
              <svg className="w-20 h-20 mx-auto mb-4 text-warmGrey-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-warmGrey-700 font-medium text-lg">Ainda não há registros</p>
              <p className="text-warmGrey-600 text-sm mt-1">Faça check-in para começar a rastrear seu tempo!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {timeLogs.map((log) => (
                <div
                  key={log.id}
                  className="bg-white/40 backdrop-blur-sm border border-white/30 rounded-xl p-5 hover:bg-white/60 hover:border-white/40 transition-all duration-300 hover:shadow-lg hover:scale-[1.01]"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        {log.checkOut ? (
                          <div className="badge bg-green-500/20 text-green-700 border-green-500/30">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Concluída
                          </div>
                        ) : (
                          <div className="badge bg-blue-500/20 text-blue-700 border-blue-500/30 animate-pulse">
                            <div className="w-2 h-2 bg-blue-600 rounded-full" />
                            Ativa
                          </div>
                        )}
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-warmGrey-700">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                          <span className="font-medium">Entrada:</span>
                          <span>{formatDate(log.checkIn)}</span>
                          <div className="flex items-center gap-1">
                            {log.checkInPhoto && (
                              <button
                                onClick={() => handleViewPhoto(log, 'checkin')}
                                className="p-1.5 rounded-lg hover:bg-primary-100/50 transition-colors group"
                                title="Ver foto de entrada"
                              >
                                <svg className="w-4 h-4 text-primary-600 group-hover:text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </button>
                            )}
                            {log.latitude && log.longitude && (
                              <a
                                href={`https://www.google.com/maps?q=${log.latitude},${log.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg hover:bg-green-100/50 transition-colors group"
                                title="Ver localização de entrada no Google Maps"
                              >
                                <svg className="w-4 h-4 text-green-600 group-hover:text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              </a>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-warmGrey-700">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span className="font-medium">Saída:</span>
                          <span>{log.checkOut ? formatDate(log.checkOut) : 'Em andamento...'}</span>
                          <div className="flex items-center gap-1">
                            {log.checkOutPhoto && (
                              <button
                                onClick={() => handleViewPhoto(log, 'checkout')}
                                className="p-1.5 rounded-lg hover:bg-primary-100/50 transition-colors group"
                                title="Ver foto de saída"
                              >
                                <svg className="w-4 h-4 text-primary-600 group-hover:text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </button>
                            )}
                            {log.outLatitude && log.outLongitude && (
                              <a
                                href={`https://www.google.com/maps?q=${log.outLatitude},${log.outLongitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg hover:bg-red-100/50 transition-colors group"
                                title="Ver localização de saída no Google Maps"
                              >
                                <svg className="w-4 h-4 text-red-600 group-hover:text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-xs text-warmGrey-600 mb-1">Duração</p>
                      <div className="text-2xl font-bold gradient-text">
                        {calculateDuration(log.checkIn, log.checkOut)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Camera Capture Modal */}
      {showCamera && (
        <CameraCapture
          onCapture={handlePhotoCapture}
          onCancel={handleCameraCancel}
          title={cameraAction === 'checkin' ? 'Capturar Foto - Check-in' : 'Capturar Foto - Check-out'}
        />
      )}

      {/* Photo Viewer Modal */}
      {photoViewerPhotos.length > 0 && (
        <PhotoViewer
          photos={photoViewerPhotos}
          initialIndex={photoViewerInitialIndex}
          onClose={handleClosePhotoViewer}
        />
      )}
    </div>
  );
}
