import { useState } from 'react';
import { Trip, TripStatus } from '@/data/travels';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Props {
  onAdd: (trip: Trip) => void;
}

const FALLBACK_IMG =
  'https://cdn.poehali.dev/projects/08b06f39-7f28-4cd0-a5fe-21db1c5a9aea/files/c7c282a4-bd6c-47c3-bfa5-c887f6c8620c.jpg';

const AddTripForm = ({ onAdd }: Props) => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<TripStatus>('visited');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [emoji, setEmoji] = useState('✈️');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const [imp, setImp] = useState(['', '', '']);

  const reset = () => {
    setCountry('');
    setCity('');
    setEmoji('✈️');
    setDate('');
    setNote('');
    setImp(['', '', '']);
    setStatus('visited');
  };

  const submit = () => {
    if (!country.trim()) return;
    onAdd({
      id: Date.now().toString(),
      country: country.trim(),
      city: city.trim() || undefined,
      emoji: emoji || '✈️',
      image: FALLBACK_IMG,
      date: date.trim() || (status === 'visited' ? 'Недавно' : 'В мечтах'),
      note: note.trim() || 'Здесь появится моя история...',
      impressions: imp.filter((i) => i.trim()).length ? imp.filter((i) => i.trim()) : ['Первое впечатление', 'Второе', 'Третье'],
      status,
    });
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full bg-sage hover:bg-sage/90 text-white font-semibold shadow-lg h-12 px-6">
          <Icon name="Plus" size={20} className="mr-1" />
          Добавить поездку
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto rounded-[1.5rem]">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl">Новая страница дневника</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="flex gap-2">
            {(['visited', 'planned'] as TripStatus[]).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
                  status === s
                    ? s === 'visited'
                      ? 'bg-sage text-white'
                      : 'bg-gold text-[hsl(30_25%_20%)]'
                    : 'bg-secondary text-muted-foreground'
                }`}
              >
                {s === 'visited' ? 'Уже была' : 'Планирую'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-2">
            <div>
              <Label>Страна</Label>
              <Input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Италия" className="mt-1" />
            </div>
            <div className="w-20">
              <Label>Эмодзи</Label>
              <Input value={emoji} onChange={(e) => setEmoji(e.target.value)} className="mt-1 text-center" maxLength={2} />
            </div>
          </div>

          <div>
            <Label>Город</Label>
            <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Рим" className="mt-1" />
          </div>

          <div>
            <Label>Дата поездки</Label>
            <Input value={date} onChange={(e) => setDate(e.target.value)} placeholder="Май 2024" className="mt-1" />
          </div>

          <div>
            <Label>Заметка</Label>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Мои впечатления и мысли..." className="mt-1" />
          </div>

          <div>
            <Label>Три впечатления</Label>
            {imp.map((v, i) => (
              <Input
                key={i}
                value={v}
                onChange={(e) => setImp(imp.map((x, j) => (j === i ? e.target.value : x)))}
                placeholder={`Впечатление ${i + 1}`}
                className="mt-1"
              />
            ))}
          </div>

          <Button onClick={submit} className="w-full rounded-full bg-sage hover:bg-sage/90 text-white font-semibold h-11">
            Сохранить в дневник
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTripForm;
