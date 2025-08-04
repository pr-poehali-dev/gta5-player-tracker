import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';

interface Player {
  id: string;
  nickname: string;
  status: 'online' | 'afk' | 'offline';
  lastSeen: Date;
  totalTime: number;
  onlineTime: number;
  afkTime: number;
  role: 'player' | 'moderator' | 'admin';
}

interface ActivityLog {
  id: string;
  playerId: string;
  playerName: string;
  action: string;
  timestamp: Date;
  details?: string;
}

const mockPlayers: Player[] = [
  { id: '1', nickname: 'VladMafia', status: 'online', lastSeen: new Date(), totalTime: 2450, onlineTime: 2200, afkTime: 250, role: 'admin' },
  { id: '2', nickname: 'CyberKnight', status: 'online', lastSeen: new Date(), totalTime: 1890, onlineTime: 1750, afkTime: 140, role: 'player' },
  { id: '3', nickname: 'NeonRider', status: 'afk', lastSeen: new Date(Date.now() - 300000), totalTime: 3200, onlineTime: 2800, afkTime: 400, role: 'moderator' },
  { id: '4', nickname: 'ShadowHacker', status: 'offline', lastSeen: new Date(Date.now() - 1800000), totalTime: 890, onlineTime: 820, afkTime: 70, role: 'player' },
  { id: '5', nickname: 'GamerPro2024', status: 'online', lastSeen: new Date(), totalTime: 4560, onlineTime: 4200, afkTime: 360, role: 'player' },
];

const mockActivityLog: ActivityLog[] = [
  { id: '1', playerId: '1', playerName: 'VladMafia', action: 'Вошел в игру', timestamp: new Date(Date.now() - 120000) },
  { id: '2', playerId: '2', playerName: 'CyberKnight', action: 'Сменил статус на AFK', timestamp: new Date(Date.now() - 180000) },
  { id: '3', playerId: '3', playerName: 'NeonRider', action: 'Покинул сервер', timestamp: new Date(Date.now() - 300000) },
  { id: '4', playerId: '4', playerName: 'ShadowHacker', action: 'Вошел в игру', timestamp: new Date(Date.now() - 450000) },
  { id: '5', playerId: '5', playerName: 'GamerPro2024', action: 'Сменил статус на онлайн', timestamp: new Date(Date.now() - 600000) },
];

export default function Index() {
  const [players, setPlayers] = useState<Player[]>(mockPlayers);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>(mockActivityLog);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [systemStatus, setSystemStatus] = useState<'active' | 'maintenance'>('active');
  const [newPlayerName, setNewPlayerName] = useState('');
  const [selectedRole, setSelectedRole] = useState<'player' | 'moderator' | 'admin'>('player');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}ч ${mins}м`;
  };

  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return `${diff} сек назад`;
    if (diff < 3600) return `${Math.floor(diff / 60)} мин назад`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ч назад`;
    return date.toLocaleDateString('ru-RU');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-neon-green';
      case 'afk': return 'text-neon-blue';
      case 'offline': return 'text-muted-foreground';
      default: return 'text-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online': return <Badge className="bg-neon-green/20 text-neon-green border-neon-green neon-glow">ОНЛАЙН</Badge>;
      case 'afk': return <Badge className="bg-neon-blue/20 text-neon-blue border-neon-blue neon-glow">АФК</Badge>;
      case 'offline': return <Badge variant="secondary">ОФЛАЙН</Badge>;
      default: return <Badge variant="outline">НЕИЗВЕСТНО</Badge>;
    }
  };

  const onlineCount = players.filter(p => p.status === 'online').length;
  const afkCount = players.filter(p => p.status === 'afk').length;
  const totalPlayers = players.length;

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      const newPlayer: Player = {
        id: String(Date.now()),
        nickname: newPlayerName.trim(),
        status: 'offline',
        lastSeen: new Date(),
        totalTime: 0,
        onlineTime: 0,
        afkTime: 0,
        role: selectedRole
      };
      setPlayers([...players, newPlayer]);
      setNewPlayerName('');
    }
  };

  const changePlayerStatus = (playerId: string, newStatus: 'online' | 'afk' | 'offline') => {
    setPlayers(players.map(player => 
      player.id === playerId 
        ? { ...player, status: newStatus, lastSeen: new Date() }
        : player
    ));
    
    const player = players.find(p => p.id === playerId);
    if (player) {
      const newLog: ActivityLog = {
        id: String(Date.now()),
        playerId,
        playerName: player.nickname,
        action: `Сменил статус на ${newStatus === 'online' ? 'онлайн' : newStatus === 'afk' ? 'AFK' : 'офлайн'}`,
        timestamp: new Date()
      };
      setActivityLog([newLog, ...activityLog.slice(0, 9)]);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-green to-neon-blue bg-clip-text text-transparent">
              GTA 5 Admin Panel
            </h1>
            <p className="text-muted-foreground text-lg">Система учета активности игроков</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Система</p>
              <Badge className={systemStatus === 'active' ? 'bg-neon-green/20 text-neon-green border-neon-green neon-glow' : 'bg-destructive/20 text-destructive border-destructive'}>
                {systemStatus === 'active' ? 'АКТИВНА' : 'ОБСЛУЖИВАНИЕ'}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Время сервера</p>
              <p className="font-mono text-neon-green">{currentTime.toLocaleTimeString('ru-RU')}</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="neon-border border-neon-green animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Онлайн игроков</CardTitle>
              <Icon name="Users" className="h-4 w-4 text-neon-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-neon-green neon-glow">{onlineCount}</div>
              <p className="text-xs text-muted-foreground">из {totalPlayers} всего</p>
            </CardContent>
          </Card>

          <Card className="neon-border border-neon-blue animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">АФК игроков</CardTitle>
              <Icon name="Pause" className="h-4 w-4 text-neon-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-neon-blue neon-glow">{afkCount}</div>
              <p className="text-xs text-muted-foreground">неактивные</p>
            </CardContent>
          </Card>

          <Card className="neon-border border-neon-pink animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Всего игроков</CardTitle>
              <Icon name="UserCheck" className="h-4 w-4 text-neon-pink" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-neon-pink neon-glow">{totalPlayers}</div>
              <p className="text-xs text-muted-foreground">зарегистрировано</p>
            </CardContent>
          </Card>

          <Card className="neon-border border-accent animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Активность</CardTitle>
              <Icon name="Activity" className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent neon-glow">
                {Math.round((onlineCount / totalPlayers) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">онлайн сейчас</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="players" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-card border border-border">
            <TabsTrigger value="players" className="data-[state=active]:bg-neon-green/20 data-[state=active]:text-neon-green">
              <Icon name="Users" className="w-4 h-4 mr-2" />
              Игроки
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-neon-blue/20 data-[state=active]:text-neon-blue">
              <Icon name="Activity" className="w-4 h-4 mr-2" />
              Журнал
            </TabsTrigger>
            <TabsTrigger value="manage" className="data-[state=active]:bg-neon-pink/20 data-[state=active]:text-neon-pink">
              <Icon name="Settings" className="w-4 h-4 mr-2" />
              Управление
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-accent/20 data-[state=active]:text-accent">
              <Icon name="BarChart3" className="w-4 h-4 mr-2" />
              Статистика
            </TabsTrigger>
          </TabsList>

          <TabsContent value="players" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-neon-green">Активные игроки</CardTitle>
                <CardDescription>Список всех игроков с их текущим статусом</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {players.map((player) => (
                    <div key={player.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <Icon name="User" className={`w-8 h-8 ${getStatusColor(player.status)}`} />
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                            player.status === 'online' ? 'bg-neon-green' : 
                            player.status === 'afk' ? 'bg-neon-blue' : 'bg-muted-foreground'
                          }`} />
                        </div>
                        <div>
                          <p className="font-semibold">{player.nickname}</p>
                          <p className="text-sm text-muted-foreground">
                            {player.role === 'admin' && '👑'} 
                            {player.role === 'moderator' && '🛡️'} 
                            {player.role} • Последний вход: {formatTimestamp(player.lastSeen)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">Время игры: {formatTime(player.totalTime)}</p>
                          <Progress value={(player.onlineTime / player.totalTime) * 100} className="w-24 mt-1" />
                        </div>
                        {getStatusBadge(player.status)}
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline" onClick={() => changePlayerStatus(player.id, 'online')} 
                                  className="text-neon-green border-neon-green hover:bg-neon-green/20">
                            <Icon name="Play" className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => changePlayerStatus(player.id, 'afk')}
                                  className="text-neon-blue border-neon-blue hover:bg-neon-blue/20">
                            <Icon name="Pause" className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => changePlayerStatus(player.id, 'offline')}
                                  className="text-muted-foreground border-muted-foreground hover:bg-muted/20">
                            <Icon name="Square" className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-neon-blue">Журнал активности</CardTitle>
                <CardDescription>Последние действия игроков на сервере</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activityLog.map((log) => (
                    <div key={log.id} className="flex items-center space-x-4 p-3 border border-border rounded-lg">
                      <Icon name="Clock" className="w-4 h-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-semibold text-neon-blue">{log.playerName}</span> 
                          <span className="mx-2">•</span>
                          {log.action}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatTimestamp(log.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-neon-pink">Добавить игрока</CardTitle>
                  <CardDescription>Регистрация нового игрока в системе</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="playerName">Никнейм игрока</Label>
                    <Input 
                      id="playerName"
                      value={newPlayerName}
                      onChange={(e) => setNewPlayerName(e.target.value)}
                      placeholder="Введите никнейм..."
                      className="border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="playerRole">Роль</Label>
                    <Select value={selectedRole} onValueChange={(value: 'player' | 'moderator' | 'admin') => setSelectedRole(value)}>
                      <SelectTrigger className="border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="player">Игрок</SelectItem>
                        <SelectItem value="moderator">Модератор</SelectItem>
                        <SelectItem value="admin">Администратор</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={addPlayer} className="w-full bg-neon-pink/20 text-neon-pink border border-neon-pink hover:bg-neon-pink hover:text-black neon-glow">
                    <Icon name="UserPlus" className="w-4 h-4 mr-2" />
                    Добавить игрока
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-accent">Системные настройки</CardTitle>
                  <CardDescription>Управление состоянием сервера</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="system-status">Статус системы</Label>
                      <p className="text-sm text-muted-foreground">Включить/выключить доступ к серверу</p>
                    </div>
                    <Switch 
                      id="system-status"
                      checked={systemStatus === 'active'}
                      onCheckedChange={(checked) => setSystemStatus(checked ? 'active' : 'maintenance')}
                    />
                  </div>
                  <div className="pt-4 border-t border-border">
                    <Button variant="destructive" className="w-full">
                      <Icon name="AlertTriangle" className="w-4 h-4 mr-2" />
                      Экстренное отключение
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-accent">Общая статистика</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Среднее время онлайн</span>
                      <span className="font-semibold">{formatTime(Math.floor(players.reduce((acc, p) => acc + p.onlineTime, 0) / players.length))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Общее время AFK</span>
                      <span className="font-semibold">{formatTime(players.reduce((acc, p) => acc + p.afkTime, 0))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Самый активный</span>
                      <span className="font-semibold text-neon-green">{players.sort((a, b) => b.totalTime - a.totalTime)[0]?.nickname}</span>
                    </div>
                  </div>
                  <Progress value={75} className="mt-4" />
                  <p className="text-xs text-muted-foreground text-center">Активность сервера за неделю</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-neon-green">Топ игроков</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {players.sort((a, b) => b.totalTime - a.totalTime).slice(0, 5).map((player, index) => (
                      <div key={player.id} className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-yellow-500 text-black' :
                          index === 1 ? 'bg-gray-400 text-black' :
                          index === 2 ? 'bg-amber-600 text-black' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{player.nickname}</p>
                          <p className="text-xs text-muted-foreground">{formatTime(player.totalTime)}</p>
                        </div>
                        {getStatusBadge(player.status)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-neon-blue">Статистика ролей</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(['admin', 'moderator', 'player'] as const).map((role) => {
                      const count = players.filter(p => p.role === role).length;
                      const percentage = (count / totalPlayers) * 100;
                      return (
                        <div key={role} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">
                              {role === 'admin' && '👑'} 
                              {role === 'moderator' && '🛡️'} 
                              {role === 'player' && '👤'} 
                              {role === 'admin' ? 'Администраторы' : role === 'moderator' ? 'Модераторы' : 'Игроки'}
                            </span>
                            <span className="font-semibold">{count}</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}