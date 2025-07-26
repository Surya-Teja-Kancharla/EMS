import mongoose from 'mongoose';

const salarySchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  basicSalary: {
    type: Number,
    required: true
  },
  allowances: {
    hra: { type: Number, default: 0 },
    transport: { type: Number, default: 0 },
    meal: { type: Number, default: 0 },
    medical: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  deductions: {
    pf: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    insurance: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true
  },
  workingDays: {
    type: Number,
    default: 22
  },
  attendedDays: {
    type: Number,
    required: true
  },
  overtime: {
    hours: { type: Number, default: 0 },
    rate: { type: Number, default: 0 }
  },
  bonus: {
    type: Number,
    default: 0
  },
  netSalary: {
    type: Number
  },
  status: {
    type: String,
    enum: ['draft', 'processed', 'paid'],
    default: 'draft'
  },
  processedDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Auto-calculate net salary before saving
salarySchema.pre('save', function(next) {
  const totalAllowances = Object.values(this.allowances).reduce((sum, val) => sum + val, 0);
  const totalDeductions = Object.values(this.deductions).reduce((sum, val) => sum + val, 0);
  const overtimePay = this.overtime.hours * this.overtime.rate;
  
  this.netSalary = this.basicSalary + totalAllowances + overtimePay + this.bonus - totalDeductions;
  next();
});

export default mongoose.model('Salary', salarySchema);
