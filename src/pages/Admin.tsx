import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  GraduationCap, Users, MessageSquare, Building2, Star,
  ArrowLeft, Search, Trash2, Loader2,
  ChevronLeft, ChevronRight, RefreshCw, Inbox,
} from 'lucide-react';
import { trpc } from '@/providers/trpc';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';

export default function Admin() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'contacts'>('overview');
  const [appPage, setAppPage] = useState(1);
  const [contactPage, setContactPage] = useState(1);
  const [appSearch, setAppSearch] = useState('');
  const [appStatus, setAppStatus] = useState('');

  // Check auth
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [authLoading, user, navigate]);

  // Fetch data
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = trpc.admin.stats.useQuery(undefined, {
    enabled: !!user,
    retry: false,
  });
  const { data: applications, isLoading: appsLoading, refetch: refetchApps } = trpc.application.list.useQuery(
    { page: appPage, limit: 10, search: appSearch || undefined, status: appStatus || undefined },
    { enabled: !!user && activeTab === 'applications', retry: false }
  );
  const { data: contacts, isLoading: contactsLoading, refetch: refetchContacts } = trpc.contact.list.useQuery(
    { page: contactPage, limit: 10 },
    { enabled: !!user && activeTab === 'contacts', retry: false }
  );
  const { data: recentApps } = trpc.admin.recentApplications.useQuery(
    { limit: 5 },
    { enabled: !!user && activeTab === 'overview', retry: false }
  );
  const { data: recentContacts } = trpc.admin.recentContacts.useQuery(
    { limit: 5 },
    { enabled: !!user && activeTab === 'overview', retry: false }
  );

  const utils = trpc.useUtils();
  const deleteApp = trpc.application.delete.useMutation({
    onSuccess: () => { utils.application.list.invalidate(); utils.admin.stats.invalidate(); },
  });
  const updateAppStatus = trpc.application.updateStatus.useMutation({
    onSuccess: () => { utils.application.list.invalidate(); utils.admin.stats.invalidate(); },
  });
  const deleteContact = trpc.contact.delete.useMutation({
    onSuccess: () => { utils.contact.list.invalidate(); utils.admin.stats.invalidate(); },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-[#1E3A8A]" />
      </div>
    );
  }

  if (!user) return null;

  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700',
    reviewing: 'bg-amber-100 text-amber-700',
    contacted: 'bg-emerald-100 text-emerald-700',
    enrolled: 'bg-purple-100 text-purple-700',
    rejected: 'bg-red-100 text-red-700',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">Back to Site</span>
              </Link>
              <div className="w-px h-6 bg-gray-200" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#1E3A8A] rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-gray-900 hidden sm:inline">Admin Dashboard</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {user && (
                <div className="flex items-center gap-2">
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 bg-[#1E3A8A] rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user.name?.charAt(0) || 'A'}
                    </div>
                  )}
                  <span className="text-sm text-gray-700 hidden sm:inline">{user.name || 'Admin'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 mb-6 border border-gray-200 w-fit">
          {[
            { key: 'overview' as const, label: 'Overview', icon: Star },
            { key: 'applications' as const, label: 'Applications', icon: Users },
            { key: 'contacts' as const, label: 'Contacts', icon: MessageSquare },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-[#1E3A8A] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {statsLoading ? (
                Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)
              ) : (
                <>
                  <StatCard icon={Users} label="Total Applications" value={stats?.totalApplications ?? 0} color="bg-blue-500" />
                  <StatCard icon={Inbox} label="New Applications" value={stats?.newApplications ?? 0} color="bg-amber-500" />
                  <StatCard icon={MessageSquare} label="Contact Messages" value={stats?.totalContacts ?? 0} color="bg-emerald-500" />
                  <StatCard icon={Building2} label="Universities" value={stats?.totalUniversities ?? 0} color="bg-purple-500" />
                </>
              )}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Applications */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">Recent Applications</h3>
                  <button onClick={() => setActiveTab('applications')} className="text-sm text-[#1E3A8A] hover:underline">View All</button>
                </div>
                {recentApps && recentApps.length > 0 ? (
                  <div className="space-y-3">
                    {recentApps.map((app) => (
                      <div key={app.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-9 h-9 bg-[#1E3A8A]/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Users className="w-4 h-4 text-[#1E3A8A]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{app.firstName} {app.lastName}</p>
                          <p className="text-xs text-gray-500">{app.program}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[app.status] || 'bg-gray-100'}`}>
                          {app.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm text-center py-8">No applications yet</p>
                )}
              </div>

              {/* Recent Contacts */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">Recent Contacts</h3>
                  <button onClick={() => setActiveTab('contacts')} className="text-sm text-[#1E3A8A] hover:underline">View All</button>
                </div>
                {recentContacts && recentContacts.length > 0 ? (
                  <div className="space-y-3">
                    {recentContacts.map((contact) => (
                      <div key={contact.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <MessageSquare className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{contact.name}</p>
                          <p className="text-xs text-gray-500 truncate">{contact.subject}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm text-center py-8">No contacts yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-5 border-b border-gray-100">
              <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search applications..."
                    value={appSearch}
                    onChange={(e) => { setAppSearch(e.target.value); setAppPage(1); }}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1E3A8A] outline-none"
                  />
                </div>
                <select
                  value={appStatus}
                  onChange={(e) => { setAppStatus(e.target.value); setAppPage(1); }}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1E3A8A] outline-none bg-white"
                >
                  <option value="">All Status</option>
                  {['new', 'reviewing', 'contacted', 'enrolled', 'rejected'].map(s => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
                <button
                  onClick={() => { refetchApps(); refetchStats(); }}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {appsLoading ? (
              <div className="p-5 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-lg" />)}
              </div>
            ) : applications?.items && applications.items.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Contact</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Program</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Country</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {applications.items.map((app) => (
                        <tr key={app.id} className="hover:bg-gray-50/50">
                          <td className="px-5 py-3 text-sm font-medium text-gray-900">{app.firstName} {app.lastName}</td>
                          <td className="px-5 py-3 text-sm text-gray-600">
                            <div>{app.email}</div>
                            <div className="text-xs text-gray-400">{app.whatsapp}</div>
                          </td>
                          <td className="px-5 py-3 text-sm text-gray-600">{app.program}</td>
                          <td className="px-5 py-3 text-sm text-gray-600">{app.country}</td>
                          <td className="px-5 py-3">
                            <select
                              value={app.status}
                              onChange={(e) => updateAppStatus.mutate({ id: app.id, status: e.target.value as 'new' | 'reviewing' | 'contacted' | 'enrolled' | 'rejected' })}
                              className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${statusColors[app.status] || 'bg-gray-100'}`}
                            >
                              {['new', 'reviewing', 'contacted', 'enrolled', 'rejected'].map(s => (
                                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-5 py-3">
                            <button
                              onClick={() => { if (confirm('Delete this application?')) deleteApp.mutate({ id: app.id }); }}
                              className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {applications.pagination && applications.pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                      Page {applications.pagination.page} of {applications.pagination.totalPages}
                    </p>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setAppPage(p => Math.max(1, p - 1))}
                        disabled={appPage <= 1}
                        className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setAppPage(p => p + 1)}
                        disabled={appPage >= (applications.pagination?.totalPages ?? 1)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="p-10 text-center">
                <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400">No applications found</p>
              </div>
            )}
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Contact Submissions</h3>
              <button onClick={() => { refetchContacts(); }} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <RefreshCw className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {contactsLoading ? (
              <div className="p-5 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-lg" />)}
              </div>
            ) : contacts?.items && contacts.items.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Subject</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Message</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {contacts.items.map((contact) => (
                        <tr key={contact.id} className="hover:bg-gray-50/50">
                          <td className="px-5 py-3 text-sm font-medium text-gray-900">{contact.name}</td>
                          <td className="px-5 py-3 text-sm text-gray-600">{contact.email}</td>
                          <td className="px-5 py-3 text-sm text-gray-600">{contact.subject}</td>
                          <td className="px-5 py-3 text-sm text-gray-600 max-w-xs truncate">{contact.message}</td>
                          <td className="px-5 py-3">
                            <button
                              onClick={() => { if (confirm('Delete this contact?')) deleteContact.mutate({ id: contact.id }); }}
                              className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {contacts.pagination && contacts.pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">Page {contacts.pagination.page} of {contacts.pagination.totalPages}</p>
                    <div className="flex gap-1">
                      <button onClick={() => setContactPage(p => Math.max(1, p - 1))} disabled={contactPage <= 1} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button onClick={() => setContactPage(p => p + 1)} disabled={contactPage >= (contacts.pagination?.totalPages ?? 1)} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="p-10 text-center">
                <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400">No contacts found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="text-2xl font-extrabold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}
