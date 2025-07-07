import React, { useState } from 'react';
import { ChevronDown, Filter, MoreHorizontal } from 'lucide-react';
import { useVerificationDocuments } from '@/hooks/useApiQuery';

const TABS = [
  { key: 'incoming', label: 'incoming request', status: 'pending' },
  { key: 'submit', label: 'Submit report', status: 'confirmed' },
  { key: 'rejected', label: 'Rejected', status: 'rejected' },
  { key: 'successful', label: 'Successful', status: 'successful' },
];

const DocumentVerifyPage: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'incoming' | 'submit' | 'rejected' | 'successful'>('submit');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Find the status for the current tab
  const currentTab = TABS.find(tab => tab.key === activeTab);
  const status = currentTab?.status || 'pending';

  // Fetch documents dynamically
  const { data: documentsData, isLoading } = useVerificationDocuments({ status, page, limit });
  const documents = documentsData?.data || [];

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(documents.map((_: any, index: number) => index));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (index: number) => {
    if (selectedItems.includes(index)) {
      setSelectedItems(selectedItems.filter(i => i !== index));
    } else {
      setSelectedItems([...selectedItems, index]);
    }
  };

  const toggleDropdown = (index: number) => {
    setShowDropdown(showDropdown === index ? null : index);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-semibold text-gray-900">Verify Document</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show stats:</span>
            <select className="bg-white border border-gray-300 rounded px-3 py-1 text-sm" title="Show stats by">
              <option>Yearly</option>
              <option>Monthly</option>
              <option>Weekly</option>
            </select>
          </div>
        </div>
        <p className="text-sm text-gray-600">Showing your Account metrics for July 19, 2021 - July 25, 2021</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Document verify</p>
              <p className="text-3xl font-bold text-gray-900">{documentsData?.stats?.totalVerifiedDocuments ?? 0}</p>
            </div>
            <div className="flex items-center text-red-500 text-sm">
              <span className="mr-1">📉</span>
              <span>{documentsData?.stats?.verifiedPercentage ?? '0%'}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total amount</p>
              <p className="text-3xl font-bold text-gray-900">₦{documentsData?.stats?.totalConfirmedAmount?.toLocaleString() ?? '0'}</p>
            </div>
            <div className="flex items-center text-green-500 text-sm">
              <span className="mr-1">📈</span>
              <span>{documentsData?.stats?.amountPercentage ?? '0%'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === tab.key
                  ? tab.key === 'submit'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-600 border-b-2 border-transparent'
                  : 'text-gray-500'
              }`}
              title={`Show ${tab.label}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{TABS.find(tab => tab.key === activeTab)?.label}</h2>
          {/* Filters */}
          <div className="flex justify-between items-center mb-6">
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-300 rounded px-4 py-2 pr-8 text-sm" title="Filter by list type">
                <option>List type</option>
                <option>Type 1</option>
                <option>Type 2</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded text-sm" title="Filter">
              <Filter className="w-4 h-4" />
              filter
            </button>
          </div>
        </div>
        {/* Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-6 text-center text-gray-500">Loading...</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedItems.length === documents.length && documents.length > 0}
                      className="rounded border-gray-300"
                      title="Select all documents"
                      aria-label="Select all documents"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {documents.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-4 text-center text-gray-500">No documents found.</td>
                  </tr>
                ) : (
                  documents.map((doc: any, index: number) => (
                    <tr key={doc._id || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(index)}
                          onChange={() => handleSelectItem(index)}
                          className="rounded border-gray-300"
                          title={`Select document ${doc._id}`}
                          aria-label={`Select document ${doc._id}`}
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{doc._id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{doc.fullName}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{doc.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{doc.documents?.map((d: any) => d.documentType).join(', ')}</td>
                      <td className="px-6 py-4 text-sm">
                        <button className="text-blue-600 hover:text-blue-700" title="View image of document">view image</button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{doc.documents?.map((d: any) => d.documentNumber).join(', ')}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 relative">
                        <button
                          onClick={() => toggleDropdown(index)}
                          className="text-gray-400 hover:text-gray-600"
                          title="Show actions"
                          aria-label="Show actions"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                        {showDropdown === index && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                            <div className="py-1">
                              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" title="Submit Report">Submit Report</button>
                              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" title="Delete Details">Delete Details</button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentVerifyPage;