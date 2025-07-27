import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Award, Plus, Search, Star, Eye, Edit, Trash2, AlertTriangle } from 'lucide-react';
import api from '../api';

// Confirmation dialog for deletion
const ConfirmationDialog = ({ onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4 shadow-xl">
        <div className="flex items-center">
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div className="ml-4 text-left">
            <h3 className="text-lg font-medium text-gray-900">Delete Review</h3>
            <p className="text-sm text-gray-500 mt-1">Are you sure you want to delete this performance review?</p>
          </div>
        </div>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button onClick={onConfirm} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm">
            Delete
          </button>
          <button onClick={onCancel} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm">
            Cancel
          </button>
        </div>
      </div>
    </div>
);

// Modal for Viewing, Adding, or Editing a Performance Review
const PerformanceModal = ({ performance, onClose, onSave, isEditing, isAdding }) => {
    const getInitialFormData = () => {
        if (performance) return performance;
        return {
            employee: '',
            period: { startDate: new Date().toISOString().split('T')[0], endDate: new Date().toISOString().split('T')[0] },
            ratings: { technical: 3, communication: 3, teamwork: 3 },
            feedback: { strengths: '', improvements: '' },
            status: 'draft'
        };
    };
    const [formData, setFormData] = useState(getInitialFormData);
    const [employees, setEmployees] = useState([]);
    useEffect(() => { if (isAdding) { api.get('/employees').then(res => setEmployees(res.data)); } }, [isAdding]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'startDate' || name === 'endDate') setFormData(p => ({ ...p, period: { ...p.period, [name]: value } }));
        else if (name === 'strengths' || name === 'improvements') setFormData(p => ({ ...p, feedback: { ...p.feedback, [name]: value } }));
        else setFormData(p => ({ ...p, [name]: value }));
    };
    const handleRatingChange = (name, value) => setFormData(p => ({ ...p, ratings: { ...p.ratings, [name]: parseInt(value) } }));
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
    const isViewOnly = !isEditing && !isAdding;
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 shadow-xl">
                <h3 className="text-lg font-medium text-gray-900 mb-4">{isAdding ? 'New Review' : isEditing ? 'Edit Review' : 'Review Details'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Employee</label>
                        {isAdding ? (<select name="employee" value={formData.employee} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg"><option value="">Select Employee</option>{employees.map(e => <option key={e._id} value={e._id}>{e.firstName} {e.lastName}</option>)}</select>) 
                        : (<input type="text" value={`${performance.employee.firstName} ${performance.employee.lastName}`} disabled className="w-full px-3 py-2 border rounded-lg bg-gray-100" />)}
                    </div>
                    <div className="grid grid-cols-2 gap-4"><input name="startDate" type="date" value={new Date(formData.period.startDate).toISOString().split('T')[0]} onChange={handleChange} disabled={isViewOnly} required className={`w-full px-3 py-2 border rounded-lg ${isViewOnly && 'bg-gray-100'}`} /><input name="endDate" type="date" value={new Date(formData.period.endDate).toISOString().split('T')[0]} onChange={handleChange} disabled={isViewOnly} required className={`w-full px-3 py-2 border rounded-lg ${isViewOnly && 'bg-gray-100'}`} /></div>
                    <div>
                        <label className="block text-sm font-medium">Ratings</label>
                        <div className="space-y-2 mt-1">{Object.keys(formData.ratings).map(key => (<div key={key} className="grid grid-cols-[120px_1fr_40px] items-center gap-4"><label htmlFor={key} className="capitalize text-sm">{key}</label><input id={key} type="range" min="1" max="5" name={key} value={formData.ratings[key]} onChange={(e) => handleRatingChange(e.target.name, e.target.value)} disabled={isViewOnly} className="w-full" /><span className="text-center font-medium">{formData.ratings[key]}</span></div>))}</div>
                    </div>
                    <textarea name="strengths" value={formData.feedback.strengths} onChange={handleChange} disabled={isViewOnly} placeholder="Strengths" rows="3" className={`w-full px-3 py-2 border rounded-lg ${isViewOnly && 'bg-gray-100'}`}></textarea>
                    <textarea name="improvements" value={formData.feedback.improvements} onChange={handleChange} disabled={isViewOnly} placeholder="Areas for Improvement" rows="3" className={`w-full px-3 py-2 border rounded-lg ${isViewOnly && 'bg-gray-100'}`}></textarea>
                    <div className="flex justify-end space-x-3 pt-4"><button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-lg">Close</button>{!isViewOnly && <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-lg">Save</button>}</div>
                </form>
            </div>
        </div>
    );
};

const Performance = () => {
  const { user } = useAuth();
  const [performances, setPerformances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalState, setModalState] = useState({ performance: null, isEditing: false, isAdding: false });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [performanceToDelete, setPerformanceToDelete] = useState(null);

  const isManagerOrAdmin = user?.role === 'admin' || user?.role === 'hr' || user?.role === 'manager';
  const isEmployee = user?.role === 'employee';

  useEffect(() => { fetchPerformances(); }, [user]);

  const fetchPerformances = async () => {
    setLoading(true);
    try {
      const url = isEmployee ? `/performance/employee/${user.employee._id}` : '/performance';
      const response = await api.get(url);
      setPerformances(response.data);
    } catch (error) { console.error('Error fetching performances:', error); } 
    finally { setLoading(false); }
  };
  
  const handleSave = async (data) => {
    try {
        if (modalState.isAdding) await api.post('/performance', data);
        else if (modalState.isEditing) await api.put(`/performance/${modalState.performance._id}`, data);
        setShowModal(false);
        fetchPerformances();
    } catch (error) { alert("Failed to save review."); }
  };

  const handleDeleteClick = (performance) => {
    setPerformanceToDelete(performance);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!performanceToDelete) return;
    try {
        await api.delete(`/performance/${performanceToDelete._id}`);
        fetchPerformances();
    } catch (error) { alert('Failed to delete review.'); } 
    finally {
        setShowDeleteConfirm(false);
        setPerformanceToDelete(null);
    }
  };

  const openModal = (performance = null, { isEditing = false, isAdding = false } = {}) => {
    setModalState({ performance, isEditing, isAdding });
    setShowModal(true);
  };

  const filteredPerformances = performances.filter(p => {
    if (!p.employee) return false;
    if (isEmployee) return true;
    const fullName = `${p.employee.firstName} ${p.employee.lastName}`;
    return fullName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const renderStars = (rating) => Array.from({ length: 5 }, (_, i) => <Star key={i} className={`h-4 w-4 ${i < Math.round(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />);

  if (loading) return <div className="flex justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">Performance Management</h1><p className="text-gray-500 mt-1">Manage employee performance reviews.</p></div>
        {isManagerOrAdmin && <button onClick={() => openModal(null, { isAdding: true })} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg"><Plus className="h-5 w-5 mr-2" /> New Review</button>}
      </div>
      {isManagerOrAdmin && <div className="bg-white rounded-xl p-4 shadow-sm border"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" /><input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg"/></div></div>}
      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-50">
            <tr>
              {!isEmployee && <th className="px-6 py-3 text-left text-xs font-medium uppercase">Employee</th>}
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Review Period</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Overall Rating</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y">
            {filteredPerformances.map((p) => (
              <tr key={p._id}>
                {!isEmployee && <td className="px-6 py-4"><div className="font-medium">{p.employee.firstName} {p.employee.lastName}</div></td>}
                <td className="px-6 py-4">{new Date(p.period.startDate).toLocaleDateString()} - {new Date(p.period.endDate).toLocaleDateString()}</td>
                <td className="px-6 py-4"><div className="flex items-center">{renderStars(p.overallRating)}<span className="font-bold ml-2">{p.overallRating.toFixed(1)}</span></div></td>
                <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => openModal(p)} className="p-2 rounded-full hover:bg-gray-100"><Eye className="h-5 w-5 text-gray-500"/></button>
                    {isManagerOrAdmin && <button onClick={() => openModal(p, { isEditing: true })} className="p-2 rounded-full hover:bg-gray-100"><Edit className="h-5 w-5 text-gray-500"/></button>}
                    {isManagerOrAdmin && <button onClick={() => handleDeleteClick(p)} className="p-2 rounded-full hover:bg-gray-100"><Trash2 className="h-5 w-5 text-red-500"/></button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && <PerformanceModal {...modalState} onClose={() => setShowModal(false)} onSave={handleSave} />}
      {showDeleteConfirm && <ConfirmationDialog onConfirm={confirmDelete} onCancel={() => setShowDeleteConfirm(false)} />}
    </div>
  );
};

export default Performance;
