import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Trip, TripStatus } from '@/data/travels';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Props {
  trips: Trip[];
  onAddMarker: (trip: Trip) => void;
}

const makeIcon = (emoji: string, status: TripStatus) =>
  L.divIcon({
    className: 'travel-marker',
    html: `<div style="
      display:flex;align-items:center;justify-content:center;
      width:38px;height:38px;border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      background:${status === 'visited' ? 'hsl(142 45% 55%)' : 'hsl(42 75% 58%)'};
      box-shadow:0 4px 10px rgba(0,0,0,0.25);border:2px solid white;">
      <span style="transform:rotate(45deg);font-size:18px;">${emoji}</span>
    </div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -36],
  });

interface Draft {
  lat: number;
  lng: number;
}

function ClickHandler({ onClick }: { onClick: (d: Draft) => void }) {
  useMapEvents({
    click(e) {
      onClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

const WorldMap = ({ trips, onAddMarker }: Props) => {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [placing, setPlacing] = useState(false);
  const [name, setName] = useState('');
  const [status, setStatus] = useState<TripStatus>('visited');

  const located = trips.filter((t) => typeof t.lat === 'number' && typeof t.lng === 'number');

  const saveDraft = () => {
    if (!draft || !name.trim()) return;
    onAddMarker({
      id: Date.now().toString(),
      country: name.trim(),
      emoji: status === 'visited' ? '📍' : '⭐',
      image:
        'https://cdn.poehali.dev/projects/08b06f39-7f28-4cd0-a5fe-21db1c5a9aea/files/c7c282a4-bd6c-47c3-bfa5-c887f6c8620c.jpg',
      date: status === 'visited' ? 'Недавно' : 'В мечтах',
      note: 'Здесь появится моя история...',
      impressions: ['Первое впечатление', 'Второе', 'Третье'],
      status,
      lat: draft.lat,
      lng: draft.lng,
    });
    setDraft(null);
    setName('');
    setPlacing(false);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sage inline-block" /> Уже была
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gold inline-block" /> Планирую
          </span>
        </div>
        <Button
          onClick={() => {
            setPlacing((p) => !p);
            setDraft(null);
          }}
          variant={placing ? 'default' : 'outline'}
          className={`rounded-full ${placing ? 'bg-sage hover:bg-sage/90 text-white' : ''}`}
        >
          <Icon name={placing ? 'X' : 'MapPinPlus'} size={18} className="mr-1" />
          {placing ? 'Отменить' : 'Поставить метку'}
        </Button>
      </div>

      {placing && (
        <div className="mb-4 flex items-center gap-2 text-sm text-sage bg-sage/10 rounded-2xl px-4 py-2 animate-fade-in">
          <Icon name="MousePointerClick" size={16} />
          Кликни по карте в том месте, где ты была или мечтаешь побывать
        </div>
      )}

      <div className="rounded-[2rem] overflow-hidden border border-border shadow-[0_20px_60px_-20px_rgba(90,110,90,0.35)]">
        <MapContainer
          center={[30, 20]}
          zoom={2}
          scrollWheelZoom
          style={{ height: '500px', width: '100%' }}
          worldCopyJump
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {placing && <ClickHandler onClick={setDraft} />}

          {located.map((t) => (
            <Marker key={t.id} position={[t.lat as number, t.lng as number]} icon={makeIcon(t.emoji, t.status)}>
              <Popup>
                <div className="text-center">
                  <div className="text-2xl">{t.emoji}</div>
                  <div className="font-semibold">{t.country}</div>
                  {t.city && <div className="text-xs text-gray-500">{t.city}</div>}
                  <div className="text-xs mt-1">{t.date}</div>
                </div>
              </Popup>
            </Marker>
          ))}

          {draft && (
            <Marker position={[draft.lat, draft.lng]} icon={makeIcon('📍', status)}>
              <Popup>Новое место</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {draft && (
        <div className="mt-4 bg-card border border-border rounded-2xl p-4 flex flex-wrap items-end gap-3 animate-fade-in">
          <div className="flex-1 min-w-[180px]">
            <label className="text-xs text-muted-foreground">Название места</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например, Италия или Париж"
              className="mt-1"
              autoFocus
            />
          </div>
          <div className="flex gap-2">
            {(['visited', 'planned'] as TripStatus[]).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  status === s
                    ? s === 'visited'
                      ? 'bg-sage text-white'
                      : 'bg-gold text-[hsl(30_25%_20%)]'
                    : 'bg-secondary text-muted-foreground'
                }`}
              >
                {s === 'visited' ? 'Была' : 'Планирую'}
              </button>
            ))}
          </div>
          <Button onClick={saveDraft} className="rounded-full bg-sage hover:bg-sage/90 text-white">
            <Icon name="Check" size={18} className="mr-1" />
            Сохранить метку
          </Button>
        </div>
      )}
    </div>
  );
};

export default WorldMap;