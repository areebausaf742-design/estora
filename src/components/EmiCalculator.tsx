import { useMemo, useState } from 'react';
import { Calculator, ChevronRight, Landmark } from 'lucide-react';
import { calculateHomeLoanEmi, BANK_HOME_LOAN_RATES } from '../utils/emi';
import { formatINR } from '../utils/format';
import { useLanguage } from '../context/LanguageContext';

interface EmiCalculatorProps {
  initialPrice?: number;
  propertyTitle?: string;
  propertyId?: string;
  onApplyLoan?: (details: {
    propertyPrice: number;
    loanAmount: number;
    downPayment: number;
    tenureYears: number;
    estimatedEmi: number;
  }) => void;
  className?: string;
}

export function EmiCalculator({
  initialPrice = 50000000, // ₹5 Cr default
  propertyTitle,
  propertyId: _propertyId,
  onApplyLoan,
  className = '',
}: EmiCalculatorProps) {
  const { t } = useLanguage();

  const [price, setPrice] = useState<number>(initialPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(20);

  const emiData = useMemo(() => {
    return calculateHomeLoanEmi({
      propertyPrice: price,
      downPaymentPercent,
      annualInterestRate: interestRate,
      tenureYears,
    });
  }, [price, downPaymentPercent, interestRate, tenureYears]);

  const downPaymentAmount = Math.round((price * downPaymentPercent) / 100);

  const handleApply = () => {
    onApplyLoan?.({
      propertyPrice: price,
      loanAmount: emiData.principalAmount,
      downPayment: downPaymentAmount,
      tenureYears,
      estimatedEmi: emiData.monthlyEmi,
    });
  };

  return (
    <div className={`emi-calculator bg-white rounded-2xl border border-[#E6DCC8] p-6 sm:p-8 shadow-sm ${className}`}>
      <div className="flex items-start justify-between gap-4 mb-6 pb-4 border-b border-[#E6DCC8]">
        <div>
          <span className="eyebrow flex items-center gap-2 mb-1">
            <Calculator size={15} className="text-[#B08A3E]" />
            {t('emi_calculator_title')}
          </span>
          <h3 className="text-xl sm:text-2xl font-serif text-[#1B1B18] m-0">
            {propertyTitle ? `EMI for ${propertyTitle}` : t('emi_calculator_title')}
          </h3>
          <p className="text-sm text-[#6B675E] m-0 mt-1">
            {t('emi_calculator_subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Property Price */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="emi-price" className="text-sm font-semibold text-[#1B1B18]">
                {t('emi_property_price')}
              </label>
              <span className="text-base font-bold text-[#2F4A3C]">
                {formatINR(price)}
              </span>
            </div>
            <input
              id="emi-price"
              type="range"
              min={2000000} // ₹20 Lakh
              max={300000000} // ₹30 Cr
              step={500000}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full accent-[#2F4A3C] h-2 bg-[#E6DCC8] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#6B675E] mt-1">
              <span>₹20 Lakh</span>
              <span>₹10 Cr</span>
              <span>₹30 Cr</span>
            </div>
          </div>

          {/* Down Payment */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="emi-downpayment" className="text-sm font-semibold text-[#1B1B18]">
                {t('emi_down_payment')} ({downPaymentPercent}%)
              </label>
              <span className="text-sm font-bold text-[#1B1B18]">
                {formatINR(downPaymentAmount)}
              </span>
            </div>
            <input
              id="emi-downpayment"
              type="range"
              min={10}
              max={80}
              step={5}
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
              className="w-full accent-[#2F4A3C] h-2 bg-[#E6DCC8] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#6B675E] mt-1">
              <span>10% (Min)</span>
              <span>20% (Recommended)</span>
              <span>80%</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="emi-interest" className="text-sm font-semibold text-[#1B1B18]">
                {t('emi_interest_rate')}
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="emi-interest-num"
                  type="number"
                  min={6}
                  max={18}
                  step={0.05}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Math.max(1, Number(e.target.value)))}
                  className="w-20 text-right px-2 py-1 text-sm border border-[#E6DCC8] rounded-md font-bold text-[#2F4A3C]"
                />
                <span className="text-xs text-[#6B675E]">% p.a.</span>
              </div>
            </div>
            <input
              id="emi-interest"
              type="range"
              min={7}
              max={14}
              step={0.1}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-[#2F4A3C] h-2 bg-[#E6DCC8] rounded-lg cursor-pointer"
            />
          </div>

          {/* Loan Tenure */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="emi-tenure" className="text-sm font-semibold text-[#1B1B18]">
                {t('emi_tenure')}
              </label>
              <span className="text-sm font-bold text-[#1B1B18]">
                {tenureYears} {t('emi_years')} ({tenureYears * 12} months)
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {[10, 15, 20, 25].map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setTenureYears(yr)}
                  className={`py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                    tenureYears === yr
                      ? 'bg-[#2F4A3C] text-white border-[#2F4A3C]'
                      : 'bg-[#FBF8F2] text-[#1B1B18] border-[#E6DCC8] hover:border-[#6B675E]'
                  }`}
                >
                  {yr} Yrs
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output & Breakdown Column */}
        <div className="lg:col-span-5 bg-[#FBF8F2] rounded-2xl border border-[#E6DCC8] p-6">
          <div className="text-center pb-5 border-b border-[#E6DCC8]">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B08A3E]">
              {t('emi_monthly_payment')}
            </span>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#2F4A3C] mt-2 mb-1">
              ₹{emiData.monthlyEmi.toLocaleString('en-IN')}
            </div>
            <span className="text-xs text-[#6B675E]">
              per month for {tenureYears} years
            </span>
          </div>

          {/* Breakdown summary */}
          <div className="py-4 space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-[#6B675E]">{t('emi_loan_amount')}</span>
              <strong className="text-[#1B1B18]">{formatINR(emiData.principalAmount)}</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#6B675E]">{t('emi_total_interest')}</span>
              <strong className="text-[#B08A3E]">{formatINR(emiData.totalInterest)}</strong>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-[#E6DCC8]/70">
              <span className="font-semibold text-[#1B1B18]">{t('emi_total_payment')}</span>
              <strong className="font-bold text-[#1B1B18]">{formatINR(emiData.totalPayment)}</strong>
            </div>
          </div>

          {/* Ratio Bar */}
          <div className="mt-2 mb-5">
            <div className="flex justify-between text-xs font-medium text-[#6B675E] mb-1.5">
              <span>{t('emi_principal_ratio')} ({emiData.principalPercentage}%)</span>
              <span>{t('emi_interest_ratio')} ({emiData.interestPercentage}%)</span>
            </div>
            <div className="w-full h-3 rounded-full bg-[#E6DCC8] overflow-hidden flex">
              <div
                style={{ width: `${emiData.principalPercentage}%` }}
                className="bg-[#2F4A3C] h-full transition-all duration-300"
              />
              <div
                style={{ width: `${emiData.interestPercentage}%` }}
                className="bg-[#B08A3E] h-full transition-all duration-300"
              />
            </div>
          </div>

          {/* Apply CTA */}
          <button
            type="button"
            onClick={handleApply}
            className="btn btn--primary btn--block w-full py-3.5 text-sm font-semibold flex items-center justify-center gap-2"
          >
            <span>{t('emi_apply_btn')}</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Indian Banks Rate Benchmark Section */}
      <div className="mt-8 pt-6 border-t border-[#E6DCC8]">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B675E] mb-3 flex items-center gap-2">
          <Landmark size={14} className="text-[#B08A3E]" />
          {t('emi_bank_rates')}
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {BANK_HOME_LOAN_RATES.map((b) => (
            <div
              key={b.bank}
              onClick={() => setInterestRate(b.rate)}
              className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                interestRate === b.rate
                  ? 'bg-[#2F4A3C] text-white border-[#2F4A3C]'
                  : 'bg-[#FBF8F2] border-[#E6DCC8] hover:border-[#B08A3E]'
              }`}
            >
              <div className="text-xs font-semibold truncate">{b.bank}</div>
              <div className="text-sm font-bold mt-1">{b.rate}%</div>
              <div className="text-[10px] opacity-75">{b.type}</div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-[#6B675E] mt-3 italic">
          * {t('emi_disclaimer')}
        </p>
      </div>
    </div>
  );
}
