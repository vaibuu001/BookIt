import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Home } from 'lucide-react';
import { Booking, Experience } from '../types';

interface LocationState {
  success: boolean;
  booking?: Booking;
  experience?: Experience;
  error?: string;
}

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  if (!state) {
    navigate('/');
    return null;
  }

  const { success, booking, experience, error } = state;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {success ? (
          <>
            <div className="flex justify-center mb-6">
              <CheckCircle className="w-20 h-20 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
            <p className="text-gray-600 mb-6">
              Your booking has been successfully confirmed. A confirmation email has been sent to{' '}
              <span className="font-medium">{booking?.customer_email}</span>.
            </p>

            {booking && experience && (
              <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                <h2 className="font-semibold text-gray-900 mb-3">Booking Details</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking ID:</span>
                    <span className="font-medium text-gray-900">{booking.id.slice(0, 8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience:</span>
                    <span className="font-medium text-gray-900">{experience.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Guests:</span>
                    <span className="font-medium text-gray-900">{booking.num_guests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Paid:</span>
                    <span className="font-medium text-gray-900">${booking.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => navigate('/')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </button>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <XCircle className="w-20 h-20 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Failed</h1>
            <p className="text-gray-600 mb-6">
              {error || 'Unfortunately, we could not process your booking. Please try again later.'}
            </p>

            <div className="space-y-3">
              <button
                onClick={() => navigate(-1)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center justify-center"
              >
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
