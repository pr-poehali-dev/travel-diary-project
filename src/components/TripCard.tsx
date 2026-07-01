import { useState } from 'react';
import { Trip, generateChecklist, Checklist } from '@/data/travels';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Props {
  trip: Trip;
  index: number;
  onDelete: (id: string) => void;
  onEdit: (trip: Trip) => void;
}

const TripCard = ({ trip, index, onDelete, onEdit }: Props) => {
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [loading, setLoading] = useState(false);

  const [editNote, setEditNote] = useState(trip.note);
  const [editDate, setEditDate] = useState(trip.date);
  const [editCity, setEditCity] = useState(trip.city ?? '');
  const [editImpressions, setEditImpressions] = useState<string[]>([...trip.impressions]);

  const isVisited = trip.status === 'visited';
  const accent = isVisited ? 'text-sage' : 'text-gold';

  const handleGenerate = () => {
    setChecklistOpen(true);
    setLoading(true);
    setChecklist(null);
    setTimeout(() => {
      setChecklist(generateChecklist(trip));
      setLoading(false);
    }, 900);
  };

  const handleSaveEdit = () => {
    onEdit({
      ...trip,
      note: editNote,
      date: editDate,
      city: editCity || undefined,
      impressions: editImpressions.filter((i) => i.trim()),
    });
    setEditOpen(false);
  };

  return (
    <>
      <article
        className="group bg-card rounded-[1.75rem] overflow-hidden border border-border shadow-[0_10px_40px_-15px_rgba(90,110,90,0.25)] hover-scale animate-fade-in opacity-0"
        style={{ animationDelay: `${index * 120}ms` }}
      >
        <div className="relative h-52 overflow-hidden">
          <img
            src={trip.image}
            alt={trip.country}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <span
            className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
              isVisited ? 'bg-sage/90 text-white' : 'bg-gold/90 text-[hsl(30_25%_20%)]'
            }`}
          >
            {isVisited ? 'Была здесь' : 'В планах'}
          </span>

          {/* Кнопки управления */}
          <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => setEditOpen(true)}
              className="w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow hover:bg-white transition-colors"
              title="Редактировать"
            >
              <Icon name="Pencil" size={14} className="text-foreground" />
            </button>
            <button
              onClick={() => onDelete(trip.id)}
              className="w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow hover:bg-red-50 transition-colors"
              title="Удалить"
            >
              <Icon name="Trash2" size={14} className="text-destructive" />
            </button>
          </div>

          <div className="absolute bottom-3 left-4 text-white">
            <h3 className="font-display text-3xl font-semibold leading-none">
              {trip.emoji} {trip.country}
            </h3>
            {trip.city && <p className="text-sm text-white/85 mt-1">{trip.city}</p>}
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className={`flex items-center gap-2 text-sm font-medium ${accent}`}>
            <Icon name="Calendar" size={16} />
            {trip.date}
          </div>

          <p className="text-muted-foreground leading-relaxed font-hand text-xl">{trip.note}</p>

          <div className="space-y-2 pt-1">
            <p className={`text-xs uppercase tracking-wider font-semibold ${accent}`}>Три впечатления</p>
            {trip.impressions.map((imp, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <Icon name="Sparkles" size={15} className={`mt-0.5 shrink-0 ${accent}`} />
                <span>{imp}</span>
              </div>
            ))}
          </div>

          {!isVisited && (
            <Button
              onClick={handleGenerate}
              className="w-full mt-2 bg-gold hover:bg-gold/90 text-[hsl(30_25%_20%)] rounded-full font-semibold"
            >
              <Icon name="ListChecks" size={18} className="mr-1" />
              Сгенерировать чек-лист
            </Button>
          )}
        </div>
      </article>

      {/* Диалог редактирования */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto rounded-[1.5rem]">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl">
              {trip.emoji} {trip.country}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-1">
            <div>
              <Label>Город</Label>
              <Input value={editCity} onChange={(e) => setEditCity(e.target.value)} className="mt-1" placeholder="Рим" />
            </div>
            <div>
              <Label>Дата</Label>
              <Input value={editDate} onChange={(e) => setEditDate(e.target.value)} className="mt-1" placeholder="Май 2024" />
            </div>
            <div>
              <Label>Заметка</Label>
              <Textarea value={editNote} onChange={(e) => setEditNote(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Впечатления</Label>
              {editImpressions.map((v, i) => (
                <Input
                  key={i}
                  value={v}
                  onChange={(e) => setEditImpressions(editImpressions.map((x, j) => (j === i ? e.target.value : x)))}
                  placeholder={`Впечатление ${i + 1}`}
                  className="mt-1"
                />
              ))}
            </div>
            <Button onClick={handleSaveEdit} className="w-full rounded-full bg-sage hover:bg-sage/90 text-white font-semibold h-11">
              Сохранить изменения
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Диалог чек-листа */}
      <Dialog open={checklistOpen} onOpenChange={setChecklistOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto rounded-[1.5rem]">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl">
              {trip.emoji} Чек-лист путешественника
            </DialogTitle>
            <p className="text-sm text-muted-foreground">{trip.country}</p>
          </DialogHeader>

          {loading && (
            <div className="py-12 flex flex-col items-center gap-3 text-muted-foreground">
              <Icon name="Loader2" size={32} className="animate-spin text-gold" />
              <p className="font-hand text-lg">Собираю чемодан...</p>
            </div>
          )}

          {checklist && (
            <div className="space-y-5 animate-fade-in">
              <Section icon="Luggage" title="Что собрать в дорогу">
                <ul className="space-y-1.5">
                  {checklist.packing.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Icon name="Check" size={15} className="mt-0.5 text-sage shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </Section>
              <Section icon="CloudSun" title="Погода">
                <p className="text-sm text-muted-foreground">{checklist.weather}</p>
              </Section>
              <Section icon="MapPin" title="Топ-3 места">
                <ol className="space-y-1.5">
                  {checklist.places.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="font-display font-semibold text-gold">{i + 1}.</span>
                      {p}
                    </li>
                  ))}
                </ol>
              </Section>
              <Section icon="Stamp" title="Виза">
                <p className="text-sm text-muted-foreground">{checklist.visa}</p>
              </Section>
              <Section icon="Coins" title="Валюта">
                <p className="text-sm text-muted-foreground">{checklist.currency}</p>
              </Section>
              <Section icon="Languages" title="Полезные фразы">
                <ul className="space-y-1.5">
                  {checklist.phrases.map((p, i) => (
                    <li key={i} className="flex justify-between text-sm border-b border-border/50 pb-1">
                      <span className="font-medium">{p.phrase}</span>
                      <span className="text-muted-foreground">{p.translation}</span>
                    </li>
                  ))}
                </ul>
              </Section>
              <Section icon="Bus" title="Местный транспорт">
                <p className="text-sm text-muted-foreground">{checklist.transport}</p>
              </Section>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

const Section = ({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) => (
  <div className="bg-secondary/50 rounded-2xl p-4">
    <h4 className="flex items-center gap-2 font-semibold mb-2">
      <Icon name={icon} size={18} className="text-gold" />
      {title}
    </h4>
    {children}
  </div>
);

export default TripCard;