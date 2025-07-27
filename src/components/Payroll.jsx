// File: src/components/Payroll.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DollarSign, Plus, Search, Download, Eye } from 'lucide-react';
import api from '../api';

// Modal to display detailed payslip information
const PayslipModal = ({ salary, onClose }) => {
    if (!salary) return null;

    const totalAllowances = Object.values(salary.allowances).reduce((sum, val) => sum + (val || 0), 0);
    const totalDeductions = Object.values(salary.deductions).reduce((sum, val) => sum + (val || 0), 0);

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 shadow-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Payslip Details</h3>
                <p className="text-gray-600 mb-4">For {new Date(salary.year, salary.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <h4 className="font-semibold mb-2">Earnings</h4>
                        <div className="space-y-1">
                            <div className="flex justify-between"><span>Basic Salary:</span> <span>₹{salary.basicSalary.toLocaleString()}</span></div>
                            <div className="flex justify-between"><span>HRA:</span> <span>₹{salary.allowances.hra?.toLocaleString() || 0}</span></div>
                            <div className="flex justify-between border-t pt-1 mt-1"><strong>Total:</strong> <strong>₹{(salary.basicSalary + totalAllowances).toLocaleString()}</strong></div>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Deductions</h4>
                        <div className="space-y-1">
                            <div className="flex justify-between"><span>Provident Fund (PF):</span> <span>₹{salary.deductions.pf?.toLocaleString() || 0}</span></div>
                            <div className="flex justify-between"><span>Tax:</span> <span>₹{salary.deductions.tax?.toLocaleString() || 0}</span></div>
                            <div className="flex justify-between border-t pt-1 mt-1"><strong>Total:</strong> <strong>₹{totalDeductions.toLocaleString()}</strong></div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t text-lg font-bold flex justify-between">
                    <span>Net Salary:</span>
                    <span>₹{salary.netSalary.toLocaleString()}</span>
                </div>

                <div className="flex justify-end pt-6">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-lg">Close</button>
                </div>
            </div>
        </div>
    );
};

// New Modal: Add Salary
const SalaryModal = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState({ employee: '', month: '', year: '', basicSalary: '', allowances: { hra: 0 }, deductions: { pf: 0, tax: 0 }, attendedDays: 22 });
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        api.get('/employees').then(res => setEmployees(res.data));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'hra') {
            setFormData(p => ({ ...p, allowances: { ...p.allowances, [name]: Number(value) } }));
        } else if (name === 'pf' || name === 'tax') {
            setFormData(p => ({ ...p, deductions: { ...p.deductions, [name]: Number(value) } }));
        } else {
            setFormData(p => ({ ...p, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 shadow-xl">
                <h3 className="text-lg font-medium mb-4">Add Salary Record</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <select name="employee" value={formData.employee} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg">
                        <option value="">Select Employee</option>
                        {employees.map(e => <option key={e._id} value={e._id}>{e.firstName} {e.lastName}</option>)}
                    </select>
                    <div className="grid grid-cols-2 gap-4">
                        <input name="month" type="number" min="1" max="12" value={formData.month} onChange={handleChange} placeholder="Month (1-12)" required className="w-full px-3 py-2 border rounded-lg" />
                        <input name="year" type="number" value={formData.year} onChange={handleChange} placeholder="Year" required className="w-full px-3 py-2 border rounded-lg" />
                    </div>
                    <input name="basicSalary" type="number" value={formData.basicSalary} onChange={handleChange} placeholder="Basic Salary" required className="w-full px-3 py-2 border rounded-lg" />
                    <input name="attendedDays" type="number" value={formData.attendedDays} onChange={handleChange} placeholder="Attended Days" required className="w-full px-3 py-2 border rounded-lg" />
                    <input name="hra" type="number" value={formData.allowances.hra} onChange={handleChange} placeholder="HRA" className="w-full px-3 py-2 border rounded-lg" />
                    <input name="pf" type="number" value={formData.deductions.pf} onChange={handleChange} placeholder="Provident Fund (PF)" className="w-full px-3 py-2 border rounded-lg" />
                    <input name="tax" type="number" value={formData.deductions.tax} onChange={handleChange} placeholder="Tax" className="w-full px-3 py-2 border rounded-lg" />
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-lg">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-lg">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Payroll = () => {
    const { user } = useAuth();
    const [salaries, setSalaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSalary, setSelectedSalary] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    const isEmployee = user?.role === 'employee';

    useEffect(() => {
        fetchSalaries();
    }, [user]);

    const fetchSalaries = async () => {
        setLoading(true);
        setError(null);
        try {
            const url = isEmployee ? '/salary/my-salary' : '/salary';
            const response = await api.get(url);
            setSalaries(response.data);
        } catch (err) {
            setError('Failed to fetch payroll data.');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSalary = async (salaryData) => {
        try {
            await api.post('/salary', salaryData);
            setShowAddModal(false);
            fetchSalaries();
        } catch (error) {
            alert('Failed to add salary record.');
        }
    };

    const handleDownload = (salary) => {
        // CORRECTED: Added a more specific safety check before generating the PDF
        if (!salary?.employee?.firstName) {
            alert("Cannot generate PDF: Employee data is missing for this record.");
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const employeeName = `${salary.employee.firstName} ${salary.employee.lastName}`;
        const month = new Date(salary.year, salary.month - 1).toLocaleString('default', { month: 'long' });
        doc.text(`Payslip for ${month} ${salary.year}`, 14, 20);
        doc.text(`Employee: ${employeeName} (ID: ${salary.employee.employeeId})`, 14, 30);
        const earnings = [['Basic Salary', `Rs. ${salary.basicSalary.toLocaleString()}`], ['HRA', `Rs. ${salary.allowances.hra?.toLocaleString() || 0}`]];
        const totalEarnings = salary.basicSalary + (salary.allowances.hra || 0);
        earnings.push(['Total Earnings', `Rs. ${totalEarnings.toLocaleString()}`]);
        const deductions = [['PF', `Rs. ${salary.deductions.pf?.toLocaleString() || 0}`], ['Tax', `Rs. ${salary.deductions.tax?.toLocaleString() || 0}`]];
        const totalDeductions = (salary.deductions.pf || 0) + (salary.deductions.tax || 0);
        deductions.push(['Total Deductions', `Rs. ${totalDeductions.toLocaleString()}`]);
        doc.autoTable({ startY: 40, head: [['Earnings', 'Amount']], body: earnings });
        doc.autoTable({ startY: doc.lastAutoTable.finalY + 10, head: [['Deductions', 'Amount']], body: deductions });
        doc.text(`Net Salary: Rs. ${salary.netSalary.toLocaleString()}`, 14, doc.lastAutoTable.finalY + 20);
        doc.save(`Payslip-${employeeName}-${month}-${salary.year}.pdf`);
    };

    const filteredSalaries = salaries.filter(salary => {
        if (!salary || !salary.employee) return false; 
        if (isEmployee) return true;
        const fullName = `${salary.employee.firstName || ''} ${salary.employee.lastName || ''}`;
        const employeeId = salary.employee.employeeId || '';
        return fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
               employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    if (loading) return <div className="flex justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Payroll</h1>
                    <p className="text-gray-500 mt-1">{isEmployee ? 'View your salary details' : 'Manage employee payroll'}</p>
                </div>
                {!isEmployee && <button onClick={() => setShowAddModal(true)} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Plus className="h-5 w-5 mr-2" /> Add Salary Record</button>}
            </div>

            {!isEmployee && (
                <div className="bg-white rounded-xl p-4 shadow-sm border">
                    <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" /><input type="text" placeholder="Search by name or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" /></div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
                <table className="min-w-full divide-y">
                    <thead className="bg-gray-50">
                        <tr>
                            {!isEmployee && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pay Period</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Salary</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y">
                        {filteredSalaries.map(salary => (
                            <tr key={salary._id}>
                                {!isEmployee && <td className="px-6 py-4"><div className="text-sm font-medium text-gray-900">{salary.employee.firstName} {salary.employee.lastName}</div><div className="text-sm text-gray-500">{salary.employee.employeeId}</div></td>}
                                <td className="px-6 py-4 text-sm text-gray-700">{months[salary.month - 1]} {salary.year}</td>
                                <td className="px-6 py-4 text-sm font-bold text-gray-900">₹{salary.netSalary.toLocaleString()}</td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button onClick={() => setSelectedSalary(salary)} className="p-2 rounded-full hover:bg-gray-100"><Eye className="h-5 w-5 text-gray-500" /></button>
                                    <button onClick={() => handleDownload(salary)} className="p-2 rounded-full hover:bg-gray-100"><Download className="h-5 w-5 text-gray-500" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedSalary && <PayslipModal salary={selectedSalary} onClose={() => setSelectedSalary(null)} />}
            {showAddModal && <SalaryModal onClose={() => setShowAddModal(false)} onSave={handleSaveSalary} />}
        </div>
    );
};

export default Payroll;
