/** @format */

'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Copy, 
  Share2, 
  Users, 
  DollarSign, 
  Gift, 
  Calendar,
  ExternalLink,
  Wallet,
  TrendingUp,
  Award,
  UserPlus,
  CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useUserContext } from '@/context/user-context';

interface ReferredUser {
  id: string;
  name: string;
  email: string;
  dateReferred: string;
  status: 'pending' | 'verified' | 'completed';
  earnings: number;
  userType: 'Agent' | 'Landowner' | 'FieldAgent';
}

interface ReferralStats {
  totalReferred: number;
  totalEarnings: number;
  pendingEarnings: number;
  completedReferrals: number;
  thisMonthEarnings: number;
}

const ReferralPage = () => {
  const { user } = useUserContext();
  const [selectedOption, setSelectedOption] = useState<'Share Invite' | 'Reward History'>('Share Invite');
  const [referralStats, setReferralStats] = useState<ReferralStats>({
    totalReferred: 0,
    totalEarnings: 0,
    pendingEarnings: 0,
    completedReferrals: 0,
    thisMonthEarnings: 0,
  });
  const [referredUsers, setReferredUsers] = useState<ReferredUser[]>([]);
  const [referralCode, setReferralCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchReferralData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock referral code
        setReferralCode(user?.email ? user.email.split('@')[0].toUpperCase() + '2024' : 'KHABITEQ2024');
        
        // Mock stats
        setReferralStats({
          totalReferred: 8,
          totalEarnings: 45000,
          pendingEarnings: 8500,
          completedReferrals: 6,
          thisMonthEarnings: 12000,
        });

        // Mock referred users
        setReferredUsers([
          {
            id: '1',
            name: 'John Doe',
            email: 'john.doe@email.com',
            dateReferred: '2024-01-15',
            status: 'completed',
            earnings: 7500,
            userType: 'Agent',
          },
          {
            id: '2', 
            name: 'Jane Smith',
            email: 'jane.smith@email.com',
            dateReferred: '2024-01-10',
            status: 'verified',
            earnings: 5000,
            userType: 'Landowner',
          },
          {
            id: '3',
            name: 'Mike Johnson', 
            email: 'mike.johnson@email.com',
            dateReferred: '2024-01-05',
            status: 'pending',
            earnings: 0,
            userType: 'Agent',
          },
          {
            id: '4',
            name: 'Sarah Wilson',
            email: 'sarah.wilson@email.com', 
            dateReferred: '2024-01-20',
            status: 'completed',
            earnings: 10000,
            userType: 'FieldAgent',
          },
          {
            id: '5',
            name: 'David Brown',
            email: 'david.brown@email.com',
            dateReferred: '2024-01-25', 
            status: 'verified',
            earnings: 3500,
            userType: 'Landowner',
          },
        ]);
      } catch (error) {
        console.error('Failed to fetch referral data:', error);
        toast.error('Failed to load referral data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReferralData();
  }, [user]);

  const copyReferralLink = async () => {
    const referralLink = `https://khabiteq.com/auth/register?ref=${referralCode}`;
    try {
      await navigator.clipboard.writeText(referralLink);
      toast.success('Referral link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const shareReferralLink = async () => {
    const referralLink = `https://khabiteq.com/auth/register?ref=${referralCode}`;
    const shareData = {
      title: 'Join Khabiteq with my referral link',
      text: 'Get verified properties and trusted agents on Khabiteq. Sign up with my referral link and let\'s both earn rewards!',
      url: referralLink,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // Fallback to copy
        copyReferralLink();
      }
    } else {
      copyReferralLink();
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      verified: { color: 'bg-blue-100 text-blue-800', text: 'Verified' },
      completed: { color: 'bg-green-100 text-green-800', text: 'Completed' },
    };
    const badge = badges[status as keyof typeof badges];
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const renderShareInvite = () => (
    <div className="space-y-6">
      {/* Referral Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-[#8DDB90] to-[#7BC87F] p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Total Referred</p>
              <p className="text-2xl font-bold">{referralStats.totalReferred}</p>
            </div>
            <Users className="w-8 h-8 text-white/80" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-[#09391C] to-[#0B423D] p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Total Earnings</p>
              <p className="text-2xl font-bold">{formatCurrency(referralStats.totalEarnings)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-white/80" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-[#FFB800] to-[#FFA000] p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">This Month</p>
              <p className="text-2xl font-bold">{formatCurrency(referralStats.thisMonthEarnings)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-white/80" />
          </div>
        </motion.div>
      </div>

      {/* Referral Link Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white p-6 rounded-xl  border border-gray-100">
        <h3 className="text-xl font-bold text-[#09391C] mb-4 flex items-center gap-2">
          <Gift className="w-6 h-6 text-[#8DDB90]" />
          Share Your Referral Link
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Referral Code
            </label>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
              <code className="flex-1 font-mono text-lg font-bold text-[#09391C]">
                {referralCode}
              </code>
              <button
                onClick={copyReferralLink}
                className="px-4 py-2 bg-[#8DDB90] text-white rounded-lg hover:bg-[#7BC87F] transition-colors flex items-center gap-2">
                <Copy className="w-4 h-4" />
                Copy Link
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={shareReferralLink}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#09391C] text-white rounded-lg hover:bg-[#0B423D] transition-colors">
              <Share2 className="w-5 h-5" />
              Share Link
            </button>
            <button
              onClick={() => window.open(`mailto:?subject=Join Khabiteq&body=Get verified properties and trusted agents on Khabiteq. Sign up with my referral link: https://khabiteq.com/auth/register?ref=${referralCode}`)}
              className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#8DDB90] text-[#8DDB90] rounded-lg hover:bg-[#8DDB90] hover:text-white transition-colors">
              <ExternalLink className="w-5 h-5" />
              Email Invite
            </button>
          </div>
        </div>
      </motion.div>

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white p-6 rounded-xl  border border-gray-100">
        <h3 className="text-xl font-bold text-[#09391C] mb-4 flex items-center gap-2">
          <Award className="w-6 h-6 text-[#8DDB90]" />
          How Referral Rewards Work
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-[#8DDB90] rounded-full flex items-center justify-center mx-auto mb-3">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-[#09391C] mb-2">1. Invite Friends</h4>
            <p className="text-sm text-gray-600">Share your referral link with friends and family</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-[#09391C] rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-[#09391C] mb-2">2. They Join</h4>
            <p className="text-sm text-gray-600">Your friend signs up and gets verified on Khabiteq</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-[#FFB800] rounded-full flex items-center justify-center mx-auto mb-3">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-[#09391C] mb-2">3. Earn Rewards</h4>
            <p className="text-sm text-gray-600">Get ₦5,000 - ₦10,000 per successful referral</p>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderRewardHistory = () => (
    <div className="space-y-6">
      {/* Earnings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-xl  border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#09391C]">Available Balance</h3>
            <Wallet className="w-6 h-6 text-[#8DDB90]" />
          </div>
          <p className="text-3xl font-bold text-[#8DDB90]">{formatCurrency(referralStats.totalEarnings - referralStats.pendingEarnings)}</p>
          <p className="text-sm text-gray-600 mt-2">Ready for withdrawal</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-xl  border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#09391C]">Pending Earnings</h3>
            <Calendar className="w-6 h-6 text-[#FFB800]" />
          </div>
          <p className="text-3xl font-bold text-[#FFB800]">{formatCurrency(referralStats.pendingEarnings)}</p>
          <p className="text-sm text-gray-600 mt-2">Awaiting completion</p>
        </motion.div>
      </div>

      {/* Referred Users List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl  border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-[#09391C] flex items-center gap-2">
            <Users className="w-6 h-6 text-[#8DDB90]" />
            Referred Users ({referredUsers.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Referred</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Earnings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {referredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-[#09391C]">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{user.userType}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(user.dateReferred).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                  <td className="px-6 py-4 text-sm font-medium text-[#8DDB90]">
                    {user.earnings > 0 ? formatCurrency(user.earnings) : '—'}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {referredUsers.length === 0 && (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No referrals yet. Start sharing your link!</p>
          </div>
        )}
      </motion.div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8DDB90]"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#EEF1F1] py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#09391C] mb-4">
            Invite Friends and Get Rewarded
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Earn money for every friend you refer to Khabiteq. Share your unique link and start earning today!
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1  border border-gray-100">
            {['Share Invite', 'Reward History'].map((option) => (
              <button
                key={option}
                onClick={() => setSelectedOption(option as typeof selectedOption)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  selectedOption === option
                    ? 'bg-[#8DDB90] text-white '
                    : 'text-[#5A5D63] hover:text-[#09391C] hover:bg-gray-50'
                }`}>
                {option}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          key={selectedOption}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}>
          {selectedOption === 'Share Invite' ? renderShareInvite() : renderRewardHistory()}
        </motion.div>
      </div>
    </div>
  );
};

export default ReferralPage;
