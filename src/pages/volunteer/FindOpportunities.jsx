import React, { useState, useEffect } from 'react';
import { eventService } from '../../services/eventService';
import EventCard from '../../components/EventCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Search, Filter, Compass, MapPin, Tag } from 'lucide-react';

export default function FindOpportunities() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('ALL');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventService.getAllEvents();
        setEvents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const categories = ['ALL', ...new Set(events.map(e => e.category).filter(Boolean))];
  const locations = ['ALL', ...new Set(events.map(e => e.location ? e.location.split(',')[0].trim() : '').filter(Boolean))];

  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.requiredSkills && e.requiredSkills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesCategory = selectedCategory === 'ALL' || e.category === selectedCategory;
    const matchesLocation = selectedLocation === 'ALL' || (e.location && e.location.includes(selectedLocation));

    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Compass className="w-6 h-6 text-primary" />
          <span>Find Volunteer Opportunities</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Explore upcoming community and social-service events looking for passionate volunteers.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search box */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by event title, cause, or required skill (e.g. Communication, Planting)..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary text-slate-800"
            />
          </div>

          {/* Category Filter */}
          <div className="md:col-span-3 relative">
            <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary text-slate-800"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'ALL' ? 'All Categories' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div className="md:col-span-3 relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary text-slate-800"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc === 'ALL' ? 'All Locations' : loc}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <LoadingSpinner text="Loading events..." />
      ) : filteredEvents.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800 mb-1">No matching opportunities found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try tweaking your search keywords or clear the category and location filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
