// src/pages/patient/MedicationRemindersPage.tsx

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Circle, Edit, Trash2, ArrowLeft, PlusCircle } from 'lucide-react';
import { mockReminders } from '../../data/mockData';
import { Reminder } from '../../types';

export const MedicationRemindersPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [reminders, setReminders] = useState<Reminder[]>(
    mockReminders.filter(r => r.patientId === user?.patientId)
  );

  const [showForm, setShowForm] = useState(false);
  const [newReminder, setNewReminder] = useState({
    medication: '',
    dosage: '',
    timeOfDay: '',
    frequency: '',
  });

  // New state to keep track of the reminder being edited
  const [editingReminderId, setEditingReminderId] = useState<string | null>(null);

  const handleToggleComplete = (id: string) => {
    setReminders(prevReminders => 
      prevReminders.map(reminder => 
        reminder.id === id 
          ? { ...reminder, isCompleted: !reminder.isCompleted } 
          : reminder
      )
    );
  };

  const handleDeleteReminder = (id: string) => {
    if (window.confirm("Are you sure you want to delete this reminder?")) {
      setReminders(prevReminders => prevReminders.filter(reminder => reminder.id !== id));
    }
  };

  const handleEditReminder = (id: string) => {
    const reminderToEdit = reminders.find(r => r.id === id);
    if (reminderToEdit) {
      setNewReminder({
        medication: reminderToEdit.medication,
        dosage: reminderToEdit.dosage,
        timeOfDay: reminderToEdit.timeOfDay,
        frequency: reminderToEdit.frequency,
      });
      setEditingReminderId(id);
      setShowForm(true);
    }
  };

  const handleAddOrUpdateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminder.medication || !newReminder.dosage || !newReminder.timeOfDay || !newReminder.frequency) {
      alert('Please fill out all fields.');
      return;
    }

    if (editingReminderId) {
      // Update existing reminder
      setReminders(prevReminders =>
        prevReminders.map(reminder =>
          reminder.id === editingReminderId
            ? { ...reminder, ...newReminder }
            : reminder
        )
      );
    } else {
      // Add a new reminder
      const reminder: Reminder = {
        id: `reminder-${Date.now()}`,
        patientId: user?.patientId || '',
        ...newReminder,
        isCompleted: false,
        timestamp: new Date().toISOString(),
      };
      setReminders(prevReminders => [...prevReminders, reminder]);
    }
    
    // Reset form states
    setNewReminder({ medication: '', dosage: '', timeOfDay: '', frequency: '' });
    setEditingReminderId(null);
    setShowForm(false);
  };

  const getDayAndTimeString = (timestamp: string): string => {
    const date = new Date(timestamp);
    const today = new Date();
    const isToday = date.getDate() === today.getDate() &&
                    date.getMonth() === today.getMonth() &&
                    date.getFullYear() === today.getFullYear();
    
    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return isToday ? `Today at ${timeString}` : date.toLocaleDateString() + ' ' + timeString;
  };

  return (
    <main id="main-content" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Medication Reminders</h1>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            // If the form is being hidden, clear the editing state
            if (showForm) {
              setEditingReminderId(null);
              setNewReminder({ medication: '', dosage: '', timeOfDay: '', frequency: '' });
            }
          }}
          className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          {showForm ? 'Cancel' : 'Add Reminder'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingReminderId ? 'Edit Reminder' : 'Add a New Reminder'}
          </h2>
          <form onSubmit={handleAddOrUpdateReminder} className="space-y-4">
            <div>
              <label htmlFor="medication" className="block text-sm font-medium text-gray-700">Medication</label>
              <input
                type="text"
                id="medication"
                value={newReminder.medication}
                onChange={(e) => setNewReminder({ ...newReminder, medication: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="dosage" className="block text-sm font-medium text-gray-700">Dosage</label>
              <input
                type="text"
                id="dosage"
                value={newReminder.dosage}
                onChange={(e) => setNewReminder({ ...newReminder, dosage: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="timeOfDay" className="block text-sm font-medium text-gray-700">Time of Day</label>
              <input
                type="text"
                id="timeOfDay"
                value={newReminder.timeOfDay}
                onChange={(e) => setNewReminder({ ...newReminder, timeOfDay: e.target.value })}
                placeholder="e.g., Morning, 8:00 AM, After meals"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">Frequency</label>
              <input
                type="text"
                id="frequency"
                value={newReminder.frequency}
                onChange={(e) => setNewReminder({ ...newReminder, frequency: e.target.value })}
                placeholder="e.g., Once daily, every 8 hours"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {editingReminderId ? 'Update Reminder' : 'Save Reminder'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        {reminders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">You have no reminders set.</p>
            <button onClick={() => setShowForm(true)} className="mt-4 text-blue-600 font-medium">
              Add New Reminder
            </button>
          </div>
        ) : (
          <ul className="space-y-4">
            {reminders.map(reminder => (
              <li key={reminder.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-md border border-gray-200 shadow-sm">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => handleToggleComplete(reminder.id)}
                    className="flex-shrink-0 text-gray-400 hover:text-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-full"
                    aria-label={reminder.isCompleted ? `Mark ${reminder.medication} as incomplete` : `Mark ${reminder.medication} as complete`}
                  >
                    {reminder.isCompleted 
                      ? <CheckCircle2 className="h-6 w-6 text-green-500" /> 
                      : <Circle className="h-6 w-6" />}
                  </button>
                  <div className="flex-1">
                    <p className={`font-medium text-gray-900 ${reminder.isCompleted ? 'line-through text-gray-500' : ''}`}>
                      {reminder.medication}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {reminder.dosage} • {getDayAndTimeString(reminder.timestamp)}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2 text-gray-400">
                  <button
                    onClick={() => handleEditReminder(reminder.id)} // <--- CALLS THE NEW EDIT FUNCTION
                    className="p-1 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
                    aria-label={`Edit ${reminder.medication}`}
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteReminder(reminder.id)}
                    className="p-1 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full"
                    aria-label={`Delete ${reminder.medication}`}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
};