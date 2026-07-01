import { useState } from 'react';
import { Trip, initialTrips } from '@/data/travels';
import Icon from '@/components/ui/icon';
import WorldMap from '@/components/WorldMap';
import TripCard from '@/components/TripCard';
import AddTripForm from '@/components/AddTripForm';

const Index = () => {
  const [trips, setTrips] = useState<Trip[]>(initialTrips);

  const visited = trips.filter((t) => t.status === 'visited');
  const planned = trips.filter((t) => t.status === 'planned');

  const addTrip = (t: Trip) => setTrips((prev) => [...prev, t]);
  const deleteTrip = (id: string) => setTrips((prev) => prev.filter((t) => t.id !== id));
  const editTrip = (updated: Trip) => setTrips((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));

  return (
    <div className="min-h-screen pb-24">
      {/* Hero */}
      <header className="relative overflow-hidden pt-20 pb-12 px-4">
        <div className="absolute top-10 left-[10%] text-6xl opacity-20 animate-float" style={{ animationDelay: '0s' }}>✈️</div>
        <div className="absolute top-24 right-[12%] text-5xl opacity-20 animate-float" style={{ animationDelay: '1.5s' }}>🧳</div>
        <div className="absolute bottom-8 left-[18%] text-4xl opacity-20 animate-float" style={{ animationDelay: '3s' }}>🗺️</div>

        <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in opacity-0">
          <p className="font-hand text-4xl text-sage mb-2">мой личный</p>
          <h1 className="font-display text-6xl md:text-7xl font-semibold text-gold leading-tight text-balance">
            Дневник путешествий
          </h1>
          <p className="text-muted-foreground mt-5 max-w-xl mx-auto leading-relaxed">
            Карта мест, где я побывала, и стран, куда однажды обязательно поеду.
            Каждая карточка — маленькая история или большая мечта.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
            <Stat value={visited.length} label="стран посещено" />
            <span className="w-px h-10 bg-border" />
            <Stat value={planned.length} label="в списке мечтаний" />
          </div>
        </div>
      </header>

      {/* Map */}
      <section className="px-4 mb-20">
        <WorldMap trips={trips} onAddMarker={addTrip} />
      </section>

      {/* Visited */}
      <Section
        icon="Plane"
        title="Где я уже была"
        subtitle="Места, которые оставили след в сердце"
        color="text-sage"
        action={<AddTripForm onAdd={addTrip} />}
      >
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {visited.map((t, i) => (
            <TripCard key={t.id} trip={t} index={i} onDelete={deleteTrip} onEdit={editTrip} />
          ))}
        </div>
      </Section>

      {/* Planned */}
      <Section
        icon="Sparkles"
        title="Куда я планирую поехать"
        subtitle="Мечты, которые скоро станут воспоминаниями"
        color="text-gold"
      >
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {planned.map((t, i) => (
            <TripCard key={t.id} trip={t} index={i} onDelete={deleteTrip} onEdit={editTrip} />
          ))}
        </div>
      </Section>

      <footer className="text-center mt-24 text-muted-foreground">
        <p className="font-hand text-2xl text-sage">Мир огромен — увидеть хочется всё ✨</p>
      </footer>
    </div>
  );
};

const Stat = ({ value, label }: { value: number; label: string }) => (
  <div>
    <div className="font-display text-4xl font-semibold text-foreground">{value}</div>
    <div className="text-sm text-muted-foreground">{label}</div>
  </div>
);

const Section = ({
  icon,
  title,
  subtitle,
  color,
  action,
  children,
}: {
  icon: string;
  title: string;
  subtitle: string;
  color: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <section className="max-w-6xl mx-auto px-4 mb-20">
    <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
      <div>
        <div className={`flex items-center gap-2 ${color} mb-1`}>
          <Icon name={icon} size={22} />
          <span className="text-sm uppercase tracking-wider font-medium">Раздел</span>
        </div>
        <h2 className="font-display text-4xl md:text-5xl font-semibold">{title}</h2>
        <p className="text-muted-foreground mt-1">{subtitle}</p>
      </div>
      {action}
    </div>
    {children}
  </section>
);

export default Index;