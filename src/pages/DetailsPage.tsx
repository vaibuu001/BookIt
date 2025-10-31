import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExperienceWithSlots, Slot } from '../types';
import { api } from '../api';
import { MapPin, Star, Clock, Calendar, Users, ArrowLeft } from 'lucide-react';

export default function DetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [experience, setExperience] = useState<ExperienceWithSlots | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [numGuests, setNumGuests] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setLoading(true);
        const data = await api.getExperienceById(id!);
        setExperience(data);
      } catch (err) {
        setError('Failed to load experience details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchExperience();
    }
  }, [id]);

  const handleBooking = () => {
    if (!selectedSlot || !experience) return;

    navigate('/checkout', {
      state: {
        experience,
        slot: selectedSlot,
        numGuests,
      },
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading experience...</p>
        </div>
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error || 'Experience not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-blue-600 hover:underline"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Experiences
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <img
              src={experience.image_url}
              alt={experience.title}
              className="w-full h-96 object-cover rounded-lg shadow-md"
            />
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded">
                  {experience.category}
                </span>
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 text-lg font-medium text-gray-700">{experience.rating}</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{experience.title}</h1>
              <div className="flex items-center text-gray-600 space-x-6 mb-6">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{experience.location}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>{experience.duration}</span>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{experience.description}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md h-fit sticky top-8">
            <div className="mb-6">
              <div className="text-3xl font-bold text-gray-900">${experience.price}</div>
              <p className="text-gray-600">per person</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Guests
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setNumGuests(Math.max(1, numGuests - 1))}
                  className="w-10 h-10 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={numGuests}
                  onChange={(e) => setNumGuests(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center border border-gray-300 rounded-md py-2"
                />
                <button
                  onClick={() => setNumGuests(numGuests + 1)}
                  className="w-10 h-10 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Date & Time
              </label>
              {experience.slots.length === 0 ? (
                <p className="text-gray-500">No available slots at the moment</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {experience.slots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot)}
                      disabled={slot.available_spots < numGuests}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        selectedSlot?.id === slot.id
                          ? 'border-blue-600 bg-blue-50'
                          : slot.available_spots < numGuests
                          ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center text-sm font-medium text-gray-900">
                            <Calendar className="w-4 h-4 mr-2" />
                            {formatDate(slot.date)}
                          </div>
                          <div className="text-sm text-gray-600 mt-1 ml-6">{slot.time}</div>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Users className="w-4 h-4 mr-1" />
                          {slot.available_spots < numGuests ? (
                            <span className="text-red-600">Sold out</span>
                          ) : (
                            <span>{slot.available_spots} spots</span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleBooking}
              disabled={!selectedSlot}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {selectedSlot ? 'Continue to Checkout' : 'Select a Time Slot'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
