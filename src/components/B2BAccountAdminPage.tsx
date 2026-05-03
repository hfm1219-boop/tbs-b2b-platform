import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, 
  Users, 
  Building2, 
  ShieldCheck, 
  History, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  UserPlus, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MapPin,
  ChevronDown,
  ArrowLeft,
  Headset,
  Home,
  Check,
  X,
  Download,
  ShoppingCart,
  Wallet,
  CreditCard,
  Target,
  TrendingUp
} from 'lucide-react';
import { 
  B2BCompanyAccount, 
  User, 
  B2BPermission, 
  B2BManagedUser, 
  ClientAccountRole,
  UserStatus,
  B2BBranch,
  B2BCity,
  B2BPointOfSale,
  B2BApprovalRule,
  B2BUserActivity
} from '../types';
import { useAnalytics } from '../hooks/useAnalytics';

interface B2BAccountAdminPageProps {
  currentUser: User;
  companyAccount: B2BCompanyAccount;
  permissions: B2BPermission[];
  onBackToAccount: () => void;
  onGoHome: () => void;
  onGoAdvisorChat: (topic?: any, context?: any) => void;
  onUpdateCompanyAccount: (updated: B2BCompanyAccount) => void;
  onCreateNotification: (notif: any) => void;
  onCreateActivity: (activity: Omit<B2BUserActivity, 'id'>) => void;
}

type AdminTab = 'resumen' | 'usuarios' | 'sucursales' | 'permisos' | 'aprobaciones' | 'actividad';

export function B2BAccountAdminPage({
  currentUser,
  companyAccount,
  permissions,
  onBackToAccount,
  onGoHome,
  onGoAdvisorChat,
  onUpdateCompanyAccount,
  onCreateNotification,
  onCreateActivity
}: B2BAccountAdminPageProps) {
  const analytics = useAnalytics(currentUser);
  const [activeTab, setActiveTab] = useState<AdminTab>('resumen');

  useEffect(() => {
    analytics.trackPageView(`/account-admin/${activeTab}`, `B2B Account Admin - ${activeTab}`);
  }, [activeTab]);

  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<ClientAccountRole | 'all'>('all');
  const [userStatusFilter, setUserStatusFilter] = useState<UserStatus | 'all'>('all');

  const [activitySearch, setActivitySearch] = useState('');
  const [activityModuleFilter, setActivityModuleFilter] = useState<'all' | 'usuarios' | 'pedidos' | 'cartera' | 'pagos' | 'sucursales'>('all');

  // Modal States
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<B2BManagedUser | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState<string | null>(null);

  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<B2BCity | null>(null);
  const [cityForm, setCityForm] = useState({ name: '' });

  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<B2BBranch | null>(null);
  const [branchForm, setBranchForm] = useState({ name: '', address: '', cityId: '' });

  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<B2BApprovalRule | null>(null);
  const [ruleForm, setRuleForm] = useState({
    name: '',
    description: '',
    minAmount: '',
    appliesToRole: '' as ClientAccountRole | '',
    appliesToCityIds: [] as string[],
    appliesToBranchIds: [] as string[],
    approverUserIds: [] as string[],
    active: true
  });

  const handleUpdateUserStatus = (userId: string, newStatus: UserStatus) => {
    const user = companyAccount.users.find(u => u.id === userId);
    if (!user) return;

    const updatedUsers = companyAccount.users.map(u => 
      u.id === userId ? { ...u, status: newStatus } : u
    );

    onUpdateCompanyAccount({ ...companyAccount, users: updatedUsers });
    onCreateActivity({
      userId: currentUser.name,
      userName: currentUser.name,
      action: 'Cambio de estado',
      detail: `Se cambió el estado de ${user.name} a ${newStatus.toUpperCase()}.`,
      date: 'Hace un momento',
      module: 'usuarios'
    });
    setUserMenuOpen(null);
  };

  const handleDeleteUser = (userId: string) => {
    const user = companyAccount.users.find(u => u.id === userId);
    if (!user) return;

    // Check if user has "movements" (activities)
    const hasMovements = companyAccount.activities.some(a => a.userName === user.name);

    if (hasMovements) {
      alert(`No se puede eliminar a ${user.name} porque ya ha realizado movimientos en el sistema (pedidos o gestiones). Te recomendamos bloquear su acceso en lugar de eliminarlo.`);
      setUserMenuOpen(null);
      return;
    }

    if (confirm(`¿Estás seguro de que deseas eliminar a ${user.name}? Esta acción no se puede deshacer.`)) {
      const updatedUsers = companyAccount.users.filter(u => u.id !== userId);
      onUpdateCompanyAccount({ ...companyAccount, users: updatedUsers });
      onCreateActivity({
        userId: currentUser.name,
        userName: currentUser.name,
        action: 'Eliminó usuario',
        detail: `Se eliminó permanentemente a ${user.name} de la cuenta.`,
        date: 'Hace un momento',
        module: 'usuarios'
      });
    }
    setUserMenuOpen(null);
  };

  // New User Form State
  const [newUserForm, setNewUserForm] = useState<{
    name: string;
    email: string;
    phone: string;
    role: ClientAccountRole;
    permissions: string[];
    purchaseLimit: string;
    assignedCityIds: string[];
    assignedBranchIds: string[];
  }>({
    name: '',
    email: '',
    phone: '',
    role: 'comprador',
    permissions: ['ver_catalogo', 'crear_pedidos', 'ver_pedidos'],
    purchaseLimit: '',
    assignedCityIds: [],
    assignedBranchIds: []
  });

  // Permisos y Roles State
  const [roleTemplates, setRoleTemplates] = useState<Record<ClientAccountRole, string[]>>({
    master: permissions.map(p => p.key),
    administrador: permissions.map(p => p.key),
    comprador: ['ver_catalogo', 'crear_pedidos', 'ver_pedidos', 'reordenar', 'gestionar_listas'],
    aprobador: ['ver_catalogo', 'aprobar_pedidos', 'ver_pedidos', 'ver_cartera'],
    finanzas: ['ver_pedidos', 'ver_cartera', 'pagar_facturas', 'ver_pagos'],
    consulta: ['ver_catalogo', 'ver_pedidos']
  });

  const [hasUnsavedRoleChanges, setHasUnsavedRoleChanges] = useState(false);

  const toggleRolePermission = (role: ClientAccountRole, permKey: string) => {
    if (role === 'master' || role === 'administrador') return; // Usually these are fixed full access

    setRoleTemplates(prev => {
      const current = prev[role];
      const next = current.includes(permKey)
        ? current.filter(k => k !== permKey)
        : [...current, permKey];
      
      return { ...prev, [role]: next };
    });
    setHasUnsavedRoleChanges(true);
  };

  const handleSaveRoleTemplates = () => {
    // In a real app we'd call an API here
    onCreateActivity({
      userId: currentUser.name,
      userName: currentUser.name,
      action: 'Actualizó roles',
      detail: 'Se modificaron los esquemas de permisos predefinidos para los roles de la cuenta.',
      date: 'Hace un momento',
      module: 'usuarios'
    });

    onCreateNotification({
      id: Date.now(),
      title: "Roles actualizados",
      message: "Los esquemas de permisos han sido guardados exitosamente.",
      type: "success",
      time: "Ahora",
      icon: "ShieldCheck",
      read: false,
      admin: true
    });

    setHasUnsavedRoleChanges(false);
  };

  const handleRoleChange = (role: ClientAccountRole) => {
    setNewUserForm(prev => ({
      ...prev,
      role,
      permissions: roleTemplates[role],
      // For master/admin assign all by default? Or keep empty? 
      // User requested explicit assignment, so let's start with empty or current selection.
    }));
  };

  const toggleCity = (cityId: string) => {
    setNewUserForm(prev => {
      const alreadyHas = prev.assignedCityIds.includes(cityId);
      let newCities = alreadyHas 
        ? prev.assignedCityIds.filter(id => id !== cityId)
        : [...prev.assignedCityIds, cityId];
      
      // Auto-filter branches if city is removed
      let newBranches = prev.assignedBranchIds;
      if (alreadyHas) {
        const branchesInCity = companyAccount.branches.filter(b => b.cityId === cityId).map(b => b.id);
        newBranches = newBranches.filter(bid => !branchesInCity.includes(bid));
      }

      return { ...prev, assignedCityIds: newCities, assignedBranchIds: newBranches };
    });
  };

  const toggleBranch = (branchId: string, cityId: string) => {
    setNewUserForm(prev => {
      const alreadyHas = prev.assignedBranchIds.includes(branchId);
      let newBranches = alreadyHas
        ? prev.assignedBranchIds.filter(id => id !== branchId)
        : [...prev.assignedBranchIds, branchId];
      
      // Auto-add city if branch is added
      let newCities = prev.assignedCityIds;
      if (!alreadyHas && !newCities.includes(cityId)) {
        newCities = [...newCities, cityId];
      }

      return { ...prev, assignedBranchIds: newBranches, assignedCityIds: newCities };
    });
  };

  const togglePermission = (key: string) => {
    setNewUserForm(prev => {
      const alreadyHas = prev.permissions.includes(key);
      if (alreadyHas) {
        return { ...prev, permissions: prev.permissions.filter(k => k !== key) };
      } else {
        return { ...prev, permissions: [...prev.permissions, key] };
      }
    });
  };

  const handleEditUser = (user: B2BManagedUser) => {
    setEditingUser(user);
    setNewUserForm({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      permissions: user.permissions,
      purchaseLimit: user.purchaseLimit?.toString() || '',
      assignedCityIds: user.assignedCityIds || [],
      assignedBranchIds: user.assignedBranchIds || []
    });
    setIsUserModalOpen(true);
  };

  const handleSubmitUser = () => {
    if (!newUserForm.name || !newUserForm.email || !newUserForm.role) return;

    if (editingUser) {
      // Update existing user
      const updatedUsers = companyAccount.users.map(u => {
        if (u.id === editingUser.id) {
          return {
            ...u,
            name: newUserForm.name,
            email: newUserForm.email,
            phone: newUserForm.phone,
            role: newUserForm.role,
            permissions: newUserForm.permissions as any[],
            purchaseLimit: newUserForm.purchaseLimit ? parseFloat(newUserForm.purchaseLimit) : 0,
            assignedCityIds: newUserForm.assignedCityIds,
            assignedBranchIds: newUserForm.assignedBranchIds
          };
        }
        return u;
      });

      const updatedAccount = {
        ...companyAccount,
        users: updatedUsers
      };

      onUpdateCompanyAccount(updatedAccount);
      analytics.track('user_edited', 'admin_action', {
        metadata: { 
          role: newUserForm.role,
          cityNameCount: newUserForm.assignedCityIds.length,
          branchNameCount: newUserForm.assignedBranchIds.length
        }
      });
      onCreateActivity({
        userId: currentUser.name,
        userName: currentUser.name,
        action: 'Editó usuario',
        detail: `Se actualizó el perfil de ${newUserForm.name}.`,
        date: 'Hace un momento',
        module: 'usuarios'
      });
    } else {
      // Create new user
      const newUser: B2BManagedUser = {
        id: `user-${Date.now()}`,
        name: newUserForm.name,
        email: newUserForm.email,
        phone: newUserForm.phone,
        role: newUserForm.role as ClientAccountRole,
        status: 'pendiente',
        assignedCityIds: newUserForm.assignedCityIds,
        assignedBranchIds: newUserForm.assignedBranchIds,
        assignedPointOfSaleIds: [],
        permissions: newUserForm.permissions as any[],
        purchaseLimit: newUserForm.purchaseLimit ? parseFloat(newUserForm.purchaseLimit) : 0,
        createdAt: new Date().toISOString().split('T')[0]
      };

      const updatedAccount = {
        ...companyAccount,
        users: [...companyAccount.users, newUser]
      };

      onUpdateCompanyAccount(updatedAccount);
      analytics.track('user_created', 'admin_action', {
        metadata: { 
          role: newUserForm.role,
          cityNameCount: newUserForm.assignedCityIds.length,
          branchNameCount: newUserForm.assignedBranchIds.length
        }
      });
      onCreateActivity({
        userId: currentUser.name,
        userName: currentUser.name,
        action: 'Creó usuario',
        detail: `Se creó el usuario ${newUser.name} con rol ${getRoleLabel(newUser.role)} y ${newUser.assignedBranchIds.length} sucursales asignadas.`,
        date: 'Hace un momento',
        module: 'usuarios'
      });

      onCreateNotification({
        id: Date.now(),
        title: "Nuevo usuario creado",
        message: `${newUser.name} ha sido invitado a la cuenta corporativa.`,
        type: "info",
        time: "Ahora",
        icon: "UserPlus",
        read: false,
        admin: true
      });
    }

    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsUserModalOpen(false);
    setEditingUser(null);
    setNewUserForm({
      name: '',
      email: '',
      phone: '',
      role: 'comprador',
      permissions: roleTemplates['comprador'],
      purchaseLimit: '',
      assignedCityIds: [],
      assignedBranchIds: []
    });
  };

  const isFormValid = newUserForm.name.trim() !== '' && 
                      newUserForm.email.trim() !== '' && 
                      newUserForm.email.includes('@') &&
                      newUserForm.role !== undefined &&
                      (newUserForm.role === 'master' || newUserForm.role === 'administrador' || newUserForm.assignedCityIds.length > 0);

  // City Handlers
  const handleOpenCityModal = (city?: B2BCity) => {
    if (city) {
      setEditingCity(city);
      setCityForm({ name: city.name });
    } else {
      setEditingCity(null);
      setCityForm({ name: '' });
    }
    setIsCityModalOpen(true);
  };

  const handleSubmitCity = () => {
    if (!cityForm.name.trim()) return;

    if (editingCity) {
      const updatedCities = companyAccount.cities.map(c => 
        c.id === editingCity.id ? { ...c, name: cityForm.name } : c
      );
      onUpdateCompanyAccount({ ...companyAccount, cities: updatedCities });
      onCreateActivity({
        userId: currentUser.name,
        userName: currentUser.name,
        action: 'Editó ciudad',
        detail: `Se actualizó el nombre de la ciudad a ${cityForm.name}.`,
        date: 'Hace un momento',
        module: 'sucursales'
      });
    } else {
      const newCity: B2BCity = {
        id: `city-${Date.now()}`,
        name: cityForm.name,
        active: true
      };
      onUpdateCompanyAccount({ ...companyAccount, cities: [...companyAccount.cities, newCity] });
      onCreateActivity({
        userId: currentUser.name,
        userName: currentUser.name,
        action: 'Creó ciudad',
        detail: `Se agregó la ciudad ${cityForm.name} a la estructura corporativa.`,
        date: 'Hace un momento',
        module: 'sucursales'
      });
    }
    setIsCityModalOpen(false);
  };

  // Branch Handlers
  const handleOpenBranchModal = (cityId: string, branch?: B2BBranch) => {
    if (branch) {
      setEditingBranch(branch);
      setBranchForm({ name: branch.name, address: branch.address, cityId: branch.cityId });
    } else {
      setEditingBranch(null);
      setBranchForm({ name: '', address: '', cityId });
    }
    setIsBranchModalOpen(true);
  };

  const handleSubmitBranch = () => {
    if (!branchForm.name.trim() || !branchForm.address.trim()) return;

    if (editingBranch) {
      const updatedBranches = companyAccount.branches.map(b => 
        b.id === editingBranch.id ? { ...b, name: branchForm.name, address: branchForm.address } : b
      );
      onUpdateCompanyAccount({ ...companyAccount, branches: updatedBranches });
      onCreateActivity({
        userId: currentUser.name,
        userName: currentUser.name,
        action: 'Editó sucursal',
        detail: `Se actualizó la sucursal ${branchForm.name}.`,
        date: 'Hace un momento',
        module: 'sucursales'
      });
    } else {
      const newBranch: B2BBranch = {
        id: `branch-${Date.now()}`,
        cityId: branchForm.cityId,
        name: branchForm.name,
        address: branchForm.address,
        active: true
      };
      onUpdateCompanyAccount({ ...companyAccount, branches: [...companyAccount.branches, newBranch] });
      onCreateActivity({
        userId: currentUser.name,
        userName: currentUser.name,
        action: 'Creó sucursal',
        detail: `Se agregó la sucursal ${branchForm.name} en la ciudad asignada.`,
        date: 'Hace un momento',
        module: 'sucursales'
      });
    }
    setIsBranchModalOpen(false);
  };

  // Approval Rules Handlers
  const handleOpenRuleModal = (rule?: B2BApprovalRule) => {
    if (rule) {
      setEditingRule(rule);
      setRuleForm({
        name: rule.name,
        description: rule.description,
        minAmount: rule.minAmount.toString(),
        appliesToRole: rule.appliesToRole || '',
        appliesToCityIds: rule.appliesToCityIds,
        appliesToBranchIds: rule.appliesToBranchIds,
        approverUserIds: rule.approverUserIds,
        active: rule.active
      });
    } else {
      setEditingRule(null);
      setRuleForm({
        name: '',
        description: '',
        minAmount: '',
        appliesToRole: '',
        appliesToCityIds: [],
        appliesToBranchIds: [],
        approverUserIds: [],
        active: true
      });
    }
    setIsRuleModalOpen(true);
  };

  const handleSubmitRule = () => {
    if (!ruleForm.name.trim() || !ruleForm.minAmount) return;

    const updatedRule: B2BApprovalRule = {
      id: editingRule ? editingRule.id : `rule-${Date.now()}`,
      name: ruleForm.name,
      description: ruleForm.description,
      minAmount: parseFloat(ruleForm.minAmount),
      appliesToRole: ruleForm.appliesToRole || undefined,
      appliesToCityIds: ruleForm.appliesToCityIds,
      appliesToBranchIds: [], // Default to all branches if empty
      approverUserIds: ruleForm.approverUserIds,
      active: ruleForm.active
    };

    let updatedRules: B2BApprovalRule[];
    if (editingRule) {
      updatedRules = companyAccount.approvalRules.map(r => r.id === editingRule.id ? updatedRule : r);
    } else {
      updatedRules = [...companyAccount.approvalRules, updatedRule];
    }

    onUpdateCompanyAccount({ ...companyAccount, approvalRules: updatedRules });
    onCreateActivity({
      userId: currentUser.name,
      userName: currentUser.name,
      action: editingRule ? 'Editó regla' : 'Creó regla',
      detail: `Se ${editingRule ? 'actualizó' : 'creó'} la regla de aprobación: ${ruleForm.name}.`,
      date: 'Hace un momento',
      module: 'usuarios'
    });

    setIsRuleModalOpen(false);
  };

  const handleDeleteRule = (ruleId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta regla de aprobación?')) {
      const updatedRules = companyAccount.approvalRules.filter(r => r.id !== ruleId);
      onUpdateCompanyAccount({ ...companyAccount, approvalRules: updatedRules });
    }
  };

  const toggleRuleActive = (rule: B2BApprovalRule) => {
    const updatedRules = companyAccount.approvalRules.map(r => 
      r.id === rule.id ? { ...r, active: !r.active } : r
    );
    onUpdateCompanyAccount({ ...companyAccount, approvalRules: updatedRules });
  };

  const handleToggleSetting = (settingKey: keyof typeof companyAccount.settings) => {
    const updatedSettings = {
      ...companyAccount.settings,
      [settingKey]: !companyAccount.settings[settingKey]
    };
    onUpdateCompanyAccount({ ...companyAccount, settings: updatedSettings });
    onCreateActivity({
      userId: currentUser.name,
      userName: currentUser.name,
      action: 'Actualizó configuración',
      detail: `Se actualizó la estrategia de aprobaciones.`,
      date: 'Hace un momento',
      module: 'usuarios'
    });
  };

  const filteredUsers = companyAccount.users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
                         u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    const matchesStatus = userStatusFilter === 'all' || u.status === userStatusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const filteredActivities = companyAccount.activities.filter(act => {
    const matchesSearch = act.userName.toLowerCase().includes(activitySearch.toLowerCase()) || 
                         act.action.toLowerCase().includes(activitySearch.toLowerCase()) || 
                         act.detail.toLowerCase().includes(activitySearch.toLowerCase());
    const matchesModule = activityModuleFilter === 'all' || act.module === activityModuleFilter;
    return matchesSearch && matchesModule;
  }).slice().reverse(); // Reverse to show most recent first

  const getRoleLabel = (role: ClientAccountRole) => {
    const roles: Record<ClientAccountRole, string> = {
      master: 'Master',
      administrador: 'Administrador',
      comprador: 'Comprador',
      aprobador: 'Aprobador',
      finanzas: 'Finanzas',
      consulta: 'Consulta',
      operador: 'Operador'
    };
    return roles[role];
  };

  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case 'activo':
        return <span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase rounded-full border border-green-100 flex items-center gap-1"><CheckCircle2 size={10} /> Activo</span>;
      case 'pendiente':
        return <span className="px-2 py-1 bg-orange-50 text-orange-600 text-[10px] font-black uppercase rounded-full border border-orange-100 flex items-center gap-1"><Clock size={10} /> Pendiente</span>;
      case 'inactivo':
        return <span className="px-2 py-1 bg-gray-50 text-gray-500 text-[10px] font-black uppercase rounded-full border border-gray-100 flex items-center gap-1"><X size={10} /> Inactivo</span>;
      case 'bloqueado':
        return <span className="px-2 py-1 bg-red-50 text-red-600 text-[10px] font-black uppercase rounded-full border border-red-100 flex items-center gap-1"><AlertCircle size={10} /> Bloqueado</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header Administrativo */}
      <div className="bg-white border-b border-borde sticky top-[108px] z-40 shadow-sm">
        <div className="max-w-[1480px] mx-auto px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-6">
              <button 
                onClick={onBackToAccount}
                className="w-10 h-10 bg-gray-100 text-texto rounded-full flex items-center justify-center hover:bg-rojo hover:text-white transition-all cursor-pointer"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-black text-texto tracking-tight">Administración de Cuenta</h1>
                  <span className="px-3 py-1 bg-rojo text-white text-[10px] font-black uppercase rounded-full tracking-widest">Portal B2B</span>
                </div>
                <p className="text-sm font-bold text-gris uppercase tracking-tight flex items-center gap-2">
                  <Briefcase size={14} /> {companyAccount.businessName} · NIT: {companyAccount.nit}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
               <button 
                onClick={() => onGoAdvisorChat('soporte', { label: 'Administración de Cuenta', type: 'solicitud_urgente' })}
                className="px-6 py-3 border border-rojo text-rojo rounded-xl font-black text-sm uppercase tracking-wider hover:bg-rojo-suave transition-all flex items-center gap-2"
              >
                <Headset size={18} /> Soporte TBS
              </button>
            </div>
          </div>

          {/* Tabs Scrolling list */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-0.5">
            {[
              { id: 'resumen', label: 'Resumen', icon: Home },
              { id: 'usuarios', label: 'Usuarios', icon: Users },
              { id: 'sucursales', label: 'Sucursales y POS', icon: Building2 },
              { id: 'permisos', label: 'Permisos y Roles', icon: ShieldCheck },
              { id: 'aprobaciones', label: 'Reglas de Aprobación', icon: CheckCircle2 },
              { id: 'actividad', label: 'Actividad de cuenta', icon: History }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2.5 px-6 py-4 text-sm font-black uppercase tracking-wider whitespace-nowrap transition-all border-b-4 ${
                  activeTab === tab.id 
                  ? 'border-rojo text-rojo' 
                  : 'border-transparent text-gris hover:text-texto hover:border-gray-200'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-[1480px] mx-auto px-8 py-10">
        <AnimatePresence mode="wait">
          {activeTab === 'resumen' && (
            <motion.div
              key="resumen"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Resumen Superior */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Usuarios', val: companyAccount.users.length, active: companyAccount.users.filter(u => u.status === 'activo').length, icon: Users, color: 'bg-blue-50 text-blue-600' },
                  { label: 'Sucursales', val: companyAccount.branches.length, active: companyAccount.branches.filter(b => b.active).length, icon: Building2, color: 'bg-indigo-50 text-indigo-600' },
                  { label: 'Reglas de Aprobación', val: companyAccount.approvalRules.length, active: companyAccount.approvalRules.filter(r => r.active).length, icon: ShieldCheck, color: 'bg-green-50 text-green-600' },
                  { label: 'Actividades (30d)', val: companyAccount.activities.length, icon: History, color: 'bg-orange-50 text-orange-600' }
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-8 rounded-3xl border border-borde tbs-shadow">
                    <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center mb-6 shadow-sm`}>
                      <stat.icon size={28} />
                    </div>
                    <div className="text-4xl font-black text-texto mb-1">{stat.val}</div>
                    <div className="text-sm font-bold text-gris uppercase tracking-tight">{stat.label}</div>
                    {stat.active !== undefined && (
                      <div className="mt-4 flex items-center gap-2 text-[11px] font-black text-green-600 uppercase">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse" />
                        {stat.active} {stat.active === 1 ? 'activo' : 'activos'}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Secciones de Atajo Directo */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Usuarios Recientes */}
                <div className="bg-white rounded-3xl border border-borde tbs-shadow overflow-hidden">
                  <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black text-texto leading-none">Usuarios recientes</h3>
                      <p className="text-sm font-semibold text-gris mt-1">Últimos accesos y registros.</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('usuarios')}
                      className="text-xs font-black text-rojo uppercase tracking-widest hover:underline"
                    >
                      Ver todos
                    </button>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {companyAccount.users.slice(0, 4).map(u => (
                      <div key={u.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-black text-texto shadow-inner">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-black text-texto leading-tight">{u.name}</div>
                            <div className="text-xs font-bold text-gris uppercase tracking-tight mt-0.5">{getRoleLabel(u.role)}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] font-bold text-gris uppercase tracking-widest mb-1">Último ingreso</div>
                          <div className="text-xs font-black text-texto">{u.lastLogin || 'No registrado'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actividad Reciente */}
                <div className="bg-white rounded-3xl border border-borde tbs-shadow overflow-hidden">
                  <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black text-texto leading-none">Registro de actividad</h3>
                      <p className="text-sm font-semibold text-gris mt-1">Cambios y acciones administrativas.</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('actividad')}
                      className="text-xs font-black text-rojo uppercase tracking-widest hover:underline"
                    >
                      Ver log completo
                    </button>
                  </div>
                  <div className="p-6 space-y-6">
                    {companyAccount.activities.slice(0, 4).map(act => (
                      <div key={act.id} className="flex gap-4">
                        <div className="mt-1 w-2 h-2 bg-rojo rounded-full shrink-0" />
                        <div>
                          <div className="text-sm font-black text-texto leading-tight">{act.action} - <span className="text-rojo font-bold uppercase text-[10px] tracking-widest">{act.module}</span></div>
                          <p className="text-xs font-medium text-gris mt-1 leading-relaxed">{act.detail}</p>
                          <div className="text-[10px] font-bold text-gris uppercase mt-1 tracking-wider">{act.date} · por {act.userName}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'usuarios' && (
            <motion.div
              key="usuarios"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {/* Toolbar */}
              <div className="bg-white p-6 rounded-3xl border border-borde tbs-shadow flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-1 gap-4 items-center w-full">
                  <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gris group-focus-within:text-rojo transition-colors" size={20} />
                    <input 
                      type="text" 
                      placeholder="Buscar por nombre o correo..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="w-full h-12 bg-gray-50 border-2 border-transparent focus:border-rojo focus:bg-white rounded-xl pl-12 pr-4 text-sm font-bold transition-all outline-none"
                    />
                  </div>
                  <div className="w-48 relative">
                    <select 
                      value={userRoleFilter}
                      onChange={(e) => setUserRoleFilter(e.target.value as any)}
                      className="w-full h-12 bg-gray-50 border-2 border-transparent rounded-xl px-4 text-xs font-black uppercase tracking-wider outline-none appearance-none cursor-pointer hover:bg-gray-100"
                    >
                      <option value="all">Filtro Cargo</option>
                      <option value="master">Master</option>
                      <option value="administrador">Administrador</option>
                      <option value="comprador">Comprador</option>
                      <option value="aprobador">Aprobador</option>
                      <option value="finanzas">Finanzas</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gris pointer-events-none" size={16} />
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setEditingUser(null);
                    setIsUserModalOpen(true);
                  }}
                  className="px-8 py-3.5 bg-rojo text-white rounded-xl font-black text-sm uppercase tracking-wider flex items-center gap-3 tbs-shadow hover:bg-rojo-oscuro transition-all w-full md:w-auto"
                >
                  <UserPlus size={20} /> Crear usuario
                </button>
              </div>

              {/* User Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredUsers.map(user => (
                  <motion.div 
                    layout
                    key={user.id} 
                    className="bg-white rounded-[32px] border border-borde p-8 tbs-shadow group hover:border-rojo/30 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center font-black text-2xl text-texto border border-gray-100 shadow-inner">
                          {user.name.charAt(0)}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getStatusBadge(user.status)}
                          <div className="text-[10px] font-black text-gris uppercase tracking-widest">{getRoleLabel(user.role)}</div>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-black text-texto mb-1">{user.name}</h3>
                      <p className="text-sm font-semibold text-gris truncate mb-6">{user.email}</p>

                      <div className="space-y-3 mb-8">
                        <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                           <div className="flex items-center gap-2">
                              <CreditCard size={14} className="text-rojo" />
                              <span className="text-[11px] font-black text-gris uppercase">Límite Compra</span>
                           </div>
                           <span className="text-sm font-black text-texto">
                              {user.purchaseLimit ? `$ ${user.purchaseLimit.toLocaleString()}` : 'Sin límite'}
                           </span>
                        </div>
                        <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                           <div className="flex items-center gap-2">
                              <ShieldCheck size={14} className="text-rojo" />
                              <span className="text-[11px] font-black text-gris uppercase">Permisos</span>
                           </div>
                           <span className="text-sm font-black text-texto">{user.permissions.length} asignados</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditUser(user)}
                        className="flex-1 py-3.5 bg-gray-100 text-texto rounded-xl font-black text-xs uppercase tracking-widest hover:bg-rojo hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                        <Edit2 size={14} /> Editar
                      </button>
                      <div className="relative">
                        <button 
                          onClick={() => setUserMenuOpen(userMenuOpen === user.id ? null : user.id)}
                          className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all border ${
                            userMenuOpen === user.id 
                            ? 'bg-rojo text-white border-rojo' 
                            : 'bg-gray-50 text-gris hover:bg-rojo-suave hover:text-rojo border-transparent hover:border-rojo/20'
                          }`}
                        >
                          <MoreVertical size={18} />
                        </button>

                        <AnimatePresence>
                          {userMenuOpen === user.id && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.9, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.9, y: 10 }}
                              className="absolute right-0 bottom-full mb-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[60] overflow-hidden"
                            >
                              <div className="p-2 space-y-1">
                                {user.status === 'pendiente' && (
                                  <button 
                                    onClick={() => {
                                      alert("Invitación reenviada a " + user.email);
                                      setUserMenuOpen(null);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-wider text-texto hover:bg-gray-50 rounded-xl transition-all"
                                  >
                                    <Plus size={14} className="text-blue-500" /> Reenviar Invitación
                                  </button>
                                )}
                                
                                {user.status !== 'activo' && (
                                  <button 
                                    onClick={() => handleUpdateUserStatus(user.id, 'activo')}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-wider text-texto hover:bg-green-50 hover:text-green-600 rounded-xl transition-all"
                                  >
                                    <CheckCircle2 size={14} /> Activar Usuario
                                  </button>
                                )}

                                {user.status === 'activo' && (
                                  <button 
                                    onClick={() => handleUpdateUserStatus(user.id, 'inactivo')}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-wider text-texto hover:bg-gray-50 rounded-xl transition-all"
                                  >
                                    <X size={14} /> Desactivar
                                  </button>
                                )}

                                {user.status !== 'bloqueado' && (
                                  <button 
                                    onClick={() => handleUpdateUserStatus(user.id, 'bloqueado')}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-wider text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                  >
                                    <AlertCircle size={14} /> Bloquear Acceso
                                  </button>
                                )}

                                <div className="h-px bg-gray-100 my-1 mx-2" />
                                
                                {companyAccount.activities.some(a => a.userName === user.name) ? (
                                  <div className="px-4 py-3 bg-gray-50/50 cursor-not-allowed group">
                                    <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-wider text-gray-300">
                                      <Trash2 size={14} /> Eliminar
                                    </div>
                                    <p className="text-[9px] font-bold text-gris leading-tight mt-1">Bloqueado: Este usuario tiene movimientos registrados (pedidos o actividad).</p>
                                  </div>
                                ) : (
                                  <button 
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-wider text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                  >
                                    <Trash2 size={14} /> Eliminar Permanentemente
                                  </button>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {userMenuOpen === user.id && (
                          <div 
                            className="fixed inset-0 z-50 pointer-events-auto" 
                            onClick={() => setUserMenuOpen(null)}
                          />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredUsers.length === 0 && (
                <div className="py-20 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search size={32} className="text-gris/40" />
                  </div>
                  <h3 className="text-xl font-black text-texto">No encontramos usuarios</h3>
                  <p className="text-gris font-medium mt-2">Prueba ajustando los filtros o la búsqueda.</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'sucursales' && (
            <motion.div
              key="sucursales"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
               <div className="flex items-center justify-between mb-8">
                <div>
                   <h2 className="text-3xl font-black tracking-tighter text-texto">Estructura Corporativa</h2>
                   <p className="text-gris font-medium mt-1">Administra tus sedes, sucursales y puntos de venta.</p>
                </div>
                <button 
                  onClick={() => handleOpenCityModal()}
                  className="px-7 py-3 bg-rojo text-white rounded-xl font-black text-sm uppercase tracking-widest flex items-center gap-2 tbs-shadow hover:bg-rojo-oscuro transition-all cursor-pointer"
                >
                  <Plus size={20} /> Nueva sede
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  {companyAccount.cities.map(city => (
                    <div key={city.id} className="bg-white rounded-[32px] border border-borde tbs-shadow overflow-hidden">
                      <div className="bg-gradient-to-r from-gray-50 to-white px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-rojo/10 text-rojo rounded-xl flex items-center justify-center">
                              <MapPin size={22} />
                           </div>
                           <h3 className="text-xl font-black text-texto">{city.name}</h3>
                        </div>
                        <button 
                          onClick={() => handleOpenCityModal(city)}
                          className="text-xs font-black text-rojo hover:underline uppercase tracking-widest cursor-pointer"
                        >
                          Editar ciudad
                        </button>
                      </div>
                      
                      <div className="p-8 grid gap-4">
                        {companyAccount.branches.filter(b => b.cityId === city.id).map(branch => (
                          <div key={branch.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-rojo/30 transition-all group">
                             <div className="flex items-start justify-between">
                                <div>
                                   <div className="text-sm font-black text-texto mb-1">{branch.name}</div>
                                   <p className="text-xs font-medium text-gris leading-relaxed max-w-sm">{branch.address}</p>
                                   <div className="mt-4 flex items-center gap-4">
                                      <div className="text-[10px] font-black text-gris uppercase tracking-wider bg-white px-2 py-1 rounded border border-gray-200">
                                         {companyAccount.pointsOfSale.filter(p => p.branchId === branch.id).length} Puntos de venta
                                      </div>
                                      <div className="text-[10px] font-black text-gris uppercase tracking-wider bg-white px-2 py-1 rounded border border-gray-200">
                                         ID: {branch.id}
                                      </div>
                                   </div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <button 
                                     onClick={() => handleOpenBranchModal(city.id, branch)}
                                     className="p-2 bg-white text-gris hover:text-rojo rounded-lg border border-gray-100 transition-colors cursor-pointer"
                                   >
                                     <Edit2 size={16} />
                                   </button>
                                   <button 
                                     onClick={() => {
                                       onCreateNotification({
                                         id: Date.now(),
                                         title: "Próximamente",
                                         message: "La gestión de puntos de venta individuales estará disponible pronto.",
                                         type: "info",
                                         time: "Ahora",
                                         icon: "AlertCircle",
                                         read: false
                                       });
                                     }}
                                     className="p-2 bg-white text-gris hover:text-rojo rounded-lg border border-gray-100 transition-colors cursor-pointer"
                                   >
                                     <Plus size={16} />
                                   </button>
                                </div>
                             </div>
                             
                             {/* Puntos de venta anidados */}
                             <div className="mt-4 pt-4 border-t border-gray-200/50 flex flex-wrap gap-2">
                                {companyAccount.pointsOfSale.filter(p => p.branchId === branch.id).map(pos => (
                                  <span key={pos.id} className="px-3 py-1 bg-white border border-[#EEF0F3] rounded-full text-[11px] font-bold text-texto-sec flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-rojo rounded-full" />
                                    {pos.name}
                                  </span>
                                ))}
                             </div>
                          </div>
                        ))}
                        <button 
                          onClick={() => handleOpenBranchModal(city.id)}
                          className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-2xl text-gris hover:text-rojo hover:border-rojo/30 transition-all font-black text-xs uppercase tracking-widest cursor-pointer"
                        >
                          <Plus size={18} /> Agregar sucursal en {city.name}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <aside className="space-y-6 shrink-0">
                   <div className="bg-rojo p-8 rounded-3xl text-white shadow-xl shadow-rojo/20 relative overflow-hidden group">
                      <ShieldCheck className="absolute top-2 w-32 h-32 text-white/5 -mr-8 transition-transform group-hover:scale-110" />
                      <div className="relative z-10">
                        <h3 className="text-xl font-black leading-tight mb-4 tracking-tight">Reglas por Sede</h3>
                        <p className="text-sm font-semibold opacity-90 leading-relaxed mb-6">
                           Las jerarquías permiten controlar quién puede comprar en qué sede y aplicar límites diferenciados.
                        </p>
                        <button 
                          onClick={() => setActiveTab('usuarios')}
                          className="w-full py-4 bg-white text-rojo rounded-xl font-black text-sm uppercase tracking-wider hover:bg-gray-50 transition-colors shadow-lg cursor-pointer flex items-center justify-center gap-2"
                        >
                           <ShieldCheck size={18} /> Configurar alcances
                        </button>
                      </div>
                   </div>

                   <div className="bg-white p-8 rounded-3xl border border-borde tbs-shadow">
                      <h4 className="text-base font-black text-texto mb-6 flex items-center gap-2">
                        <TrendingUp size={18} className="text-rojo" /> Indicadores por sede
                      </h4>
                      <div className="space-y-6">
                        {companyAccount.cities.map(c => {
                          const branches = companyAccount.branches.filter(b => b.cityId === c.id);
                          return (
                            <div key={c.id}>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-black uppercase text-gris-oscuro">{c.name}</span>
                                <span className="text-xs font-black text-texto">{branches.length} sedes</span>
                              </div>
                              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-rojo" style={{ width: `${(branches.length / companyAccount.branches.length) * 100}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                   </div>
                </aside>
              </div>
            </motion.div>
          )}

          {activeTab === 'permisos' && (
            <motion.div
              key="permisos"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="bg-white rounded-[32px] border border-borde tbs-shadow overflow-hidden">
                <div className="p-10 border-b border-gray-50 bg-gray-50/30">
                  <h2 className="text-3xl font-black tracking-tighter text-texto mb-2">Matriz de Permisos</h2>
                  <p className="text-gris font-medium">Define las capacidades de cada cargo en el portal TBS.</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-white">
                        <th className="p-8 text-left border-b border-r border-gray-100 sticky left-0 bg-white z-10 w-[300px]">
                          <span className="text-xs font-black uppercase tracking-[0.2em] text-gris">Permiso / Capacidad</span>
                        </th>
                        {['master', 'administrador', 'comprador', 'aprobador', 'finanzas', 'consulta'].map(role => (
                          <th key={role} className="p-6 text-center border-b border-gray-50 min-w-[140px]">
                            <div className="flex flex-col items-center gap-2">
                               <div className="p-3 bg-rojo/5 text-rojo rounded-xl">
                                  <ShieldCheck size={20} />
                               </div>
                               <span className="text-[11px] font-black uppercase tracking-widest text-texto leading-none">{getRoleLabel(role as any)}</span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {permissions.map((perm) => (
                        <tr key={perm.key} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-6 border-r border-gray-50 sticky left-0 bg-white z-10 group-hover:bg-gray-50/50">
                            <div className="font-black text-texto text-sm mb-0.5">{perm.label}</div>
                            <div className="text-[11px] font-medium text-gris leading-tight">{perm.description}</div>
                          </td>
                          {['master', 'administrador', 'comprador', 'aprobador', 'finanzas', 'consulta'].map(roleId => {
                             const role = roleId as ClientAccountRole;
                             const hasPerm = roleTemplates[role].includes(perm.key);
                             const isLocked = role === 'master' || role === 'administrador';

                             return (
                              <td key={role} className="p-4 text-center">
                                <div className="flex justify-center">
                                  <button
                                    disabled={isLocked}
                                    onClick={() => toggleRolePermission(role, perm.key)}
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                                      hasPerm 
                                      ? 'bg-rojo text-white shadow-lg shadow-rojo/20' 
                                      : 'bg-gray-50 text-gray-200 hover:bg-gray-100 hover:text-gray-300'
                                    } ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                  >
                                    {hasPerm ? <Check size={20} strokeWidth={4} /> : <Plus size={16} />}
                                  </button>
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-10 bg-gray-50 border-t border-gray-100 flex flex-col items-center gap-6">
                   <p className="text-sm font-bold text-gris uppercase tracking-widest">
                     {hasUnsavedRoleChanges 
                       ? 'Tienes cambios sin guardar en la configuración de roles.' 
                       : 'La configuración de roles define los permisos por defecto para nuevos usuarios.'
                     }
                   </p>
                   
                   <div className="flex items-center gap-4">
                     {hasUnsavedRoleChanges && (
                       <button 
                         onClick={handleSaveRoleTemplates}
                         className="px-12 py-5 bg-rojo text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-rojo-oscuro transition-all tbs-shadow flex items-center gap-3"
                       >
                         <ShieldCheck size={20} /> Guardar Configuración de Roles
                       </button>
                     )}
                     
                     <button 
                      onClick={() => onGoAdvisorChat('soporte', { label: 'Permisos y Roles', type: 'solicitud_urgente' })}
                      className={`px-8 py-4 bg-white border border-borde text-texto rounded-2xl font-black text-sm uppercase tracking-widest hover:border-rojo hover:text-rojo transition-all tbs-shadow flex items-center gap-2 ${hasUnsavedRoleChanges ? 'hidden md:flex' : 'flex'}`}
                     >
                       <Headset size={18} /> Solicitar asistencia TBS
                     </button>
                   </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'aprobaciones' && (
            <motion.div
              key="aprobaciones"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
                <div className="space-y-6">
                  {companyAccount.approvalRules.map(rule => (
                    <div key={rule.id} className="bg-white rounded-[32px] border border-borde p-8 tbs-shadow group hover:border-rojo/30 transition-all">
                       <div className="flex items-start justify-between mb-8">
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={() => toggleRuleActive(rule)}
                              className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all ${rule.active ? 'bg-rojo text-white cursor-pointer hover:scale-105' : 'bg-gray-100 text-gris cursor-pointer hover:bg-gray-200'}`}
                            >
                               <ShieldCheck size={28} />
                            </button>
                            <div>
                               <h3 className="text-xl font-black text-texto tracking-tight">{rule.name}</h3>
                               <p className="text-sm font-semibold text-gris mt-0.5">{rule.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${rule.active ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-gray-50 text-gray-500 border border-gray-100'}`}>
                                 {rule.active ? 'Activa' : 'Inactiva'}
                              </div>
                             <button 
                               onClick={() => handleOpenRuleModal(rule)}
                               className="p-2.5 bg-gray-50 text-gris hover:text-rojo hover:bg-rojo-suave rounded-xl border border-transparent hover:border-rojo/20 transition-all cursor-pointer"
                             >
                               <Edit2 size={18} />
                             </button>
                             <button 
                               onClick={() => handleDeleteRule(rule.id)}
                               className="p-2.5 bg-gray-50 text-gris hover:text-rojo hover:bg-rojo-suave rounded-xl border border-transparent hover:border-rojo/20 transition-all cursor-pointer"
                             >
                               <Trash2 size={18} />
                             </button>
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                             <div className="text-[10px] font-black text-gris uppercase tracking-[0.15em] mb-2 px-1">Monto Mínimo</div>
                             <div className="text-lg font-black text-texto">$ {rule.minAmount.toLocaleString()}</div>
                          </div>
                          <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                             <div className="text-[10px] font-black text-gris uppercase tracking-[0.15em] mb-2 px-1">Aplica A</div>
                             <div className="text-sm font-black text-texto uppercase tracking-tight">{rule.appliesToRole ? getRoleLabel(rule.appliesToRole) : 'Todos los roles'}</div>
                          </div>
                          <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                             <div className="text-[10px] font-black text-gris uppercase tracking-[0.15em] mb-2 px-1">Sedes</div>
                             <div className="text-sm font-black text-texto">
                                {rule.appliesToCityIds.length === 0 ? 'Todas las ciudades' : `${rule.appliesToCityIds.length} ciudades asignadas`}
                             </div>
                          </div>
                       </div>

                       <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <span className="text-xs font-black text-gris uppercase tracking-widest">Aprobado por:</span>
                             <div className="flex -space-x-3">
                                {rule.approverUserIds.map((aid, idx) => {
                                  const approver = companyAccount.users.find(u => u.id === aid);
                                  return (
                                    <div key={idx} className="w-10 h-10 rounded-full bg-white border-2 border-white ring-2 ring-gray-50 flex items-center justify-center text-[11px] font-black text-texto shadow-sm" title={approver?.name}>
                                       {approver?.name.charAt(0)}
                                    </div>
                                  );
                                })}
                             </div>
                          </div>
                          <button 
                            onClick={() => handleOpenRuleModal(rule)}
                            className="text-xs font-black text-rojo uppercase tracking-wider hover:underline cursor-pointer"
                          >
                            Ver detalle de regla →
                          </button>
                       </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => handleOpenRuleModal()}
                    className="w-full py-20 border-2 border-dashed border-gray-200 rounded-[40px] text-gris hover:border-rojo/30 hover:text-rojo hover:bg-rojo/5 transition-all group flex flex-col items-center justify-center cursor-pointer"
                  >
                    <div className="w-[72px] h-[72px] rounded-full bg-gray-50 text-gris group-hover:bg-white group-hover:text-rojo shadow-sm flex items-center justify-center mb-6 transition-colors">
                       <Plus size={36} />
                    </div>
                    <span className="text-xl font-black tracking-tight">Crear nueva regla de aprobación</span>
                    <span className="text-sm font-semibold opacity-60 mt-2">Personaliza el flujo de compras de tu empresa.</span>
                  </button>
                </div>

                <aside className="space-y-6">
                   <div className="bg-white p-8 rounded-[40px] border border-borde tbs-shadow">
                      <div className="flex items-center gap-3 mb-8">
                         <div className="w-11 h-11 bg-rojo-suave text-rojo rounded-xl flex items-center justify-center shadow-inner">
                            <Target size={22} />
                         </div>
                         <h4 className="text-[17px] font-black text-texto leading-none tracking-tight">Estrategia de aprobaciones</h4>
                      </div>
                      <div className="space-y-6">
                         {[
                           { t: 'Pedidos sobre cupo', d: 'Activar aprobación obligatoria si el pedido excede el cupo disponible.', active: companyAccount.settings.approveOrdersOverLimit, key: 'approveOrdersOverLimit' },
                           { t: 'Pedidos urgentes', d: 'Notificar al master sobre cualquier pedido marcado como urgente.', active: companyAccount.settings.notifyUrgentOrders, key: 'notifyUrgentOrders' },
                           { t: 'Nuevos usuarios', d: 'Requerir validación de perfil TBS para activar nuevos usuarios.', active: companyAccount.settings.validateNewUsers, key: 'validateNewUsers' }
                         ].map((strat, i) => (
                           <div key={i} className="flex items-start gap-4">
                              <button 
                                onClick={() => handleToggleSetting(strat.key as any)}
                                className={`mt-1 flex-shrink-0 w-11 h-6 rounded-full p-1 transition-colors cursor-pointer ${strat.active ? 'bg-rojo' : 'bg-gray-200'} outline-none border-none`}
                              >
                                 <div className={`w-4 h-4 bg-white rounded-full transition-transform ${strat.active ? 'translate-x-5' : 'translate-x-0'}`} />
                              </button>
                              <div>
                                 <div className="text-[13px] font-black text-texto leading-tight mb-1">{strat.t}</div>
                                 <p className="text-[11px] font-semibold text-gris leading-tight">{strat.d}</p>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="bg-rojo p-8 rounded-[40px] text-white shadow-2xl shadow-rojo/20 relative overflow-hidden group">
                      <ShieldCheck className="absolute -right-6 -top-6 w-48 h-48 text-white/5 rotate-12 transition-transform group-hover:scale-110" />
                      <div className="relative z-10">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/30">
                           <AlertCircle size={28} />
                        </div>
                        <h3 className="text-2xl font-black leading-tight mb-4 tracking-tighter">Jerarquías y Límites</h3>
                        <p className="text-sm font-semibold opacity-90 leading-relaxed mb-8">
                           Recuerda que un límite de compra personal no puede ser superior al cupo corporativo asignado por TBS.
                        </p>
                        <button 
                          onClick={() => onGoAdvisorChat('soporte', { label: 'Revisión de Cupos', type: 'solicitud_urgente' })}
                          className="w-full py-5 bg-white text-rojo rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-50 transition-all shadow-lg flex items-center justify-center gap-3 cursor-pointer group/btn"
                        >
                           <TrendingUp size={18} className="transition-transform group-hover/btn:translate-y-[-2px]" />
                           Revisar cupos TBS
                        </button>
                      </div>
                   </div>
                </aside>
              </div>
            </motion.div>
          )}

          {activeTab === 'actividad' && (
            <motion.div
              key="actividad"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="bg-white rounded-[32px] border border-borde tbs-shadow overflow-hidden">
                <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <div>
                    <h2 className="text-3xl font-black tracking-tighter text-texto mb-1">Registro Histórico</h2>
                    <p className="text-sm font-bold text-gris uppercase tracking-tight">Monitoreo de acciones de cuenta B2B</p>
                  </div>
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gris" size={18} />
                      <input 
                        type="text"
                        value={activitySearch}
                        onChange={(e) => setActivitySearch(e.target.value)}
                        placeholder="Buscar por usuario o acción..."
                        className="pl-12 pr-6 py-3 bg-white border border-borde rounded-xl text-sm font-bold w-64 focus:border-rojo outline-none transition-all shadow-sm"
                      />
                    </div>
                    <select 
                      value={activityModuleFilter}
                      onChange={(e) => setActivityModuleFilter(e.target.value as any)}
                      className="px-5 py-3 bg-white border border-borde text-texto rounded-xl text-xs font-black uppercase tracking-widest outline-none focus:border-rojo shadow-sm cursor-pointer"
                    >
                       <option value="all">Todos los módulos</option>
                       <option value="usuarios">Usuarios</option>
                       <option value="sucursales">Sucursales</option>
                       <option value="pedidos">Pedidos</option>
                       <option value="cartera">Cartera</option>
                       <option value="pagos">Pagos</option>
                    </select>
                    <button 
                      onClick={() => {
                        onCreateNotification({
                          id: Date.now(),
                          title: "Generando Reporte",
                          message: "Tu reporte detallado en CSV se está preparando. Se descargará automáticamente.",
                          type: "info",
                          time: "Ahora",
                          icon: "Download",
                          read: false
                        });
                      }}
                      className="px-6 py-3 bg-rojo text-white rounded-xl text-xs font-black uppercase tracking-widest tbs-shadow hover:bg-rojo-oscuro transition-all cursor-pointer flex items-center gap-2"
                    >
                       <Download size={18} /> Descargar reporte
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="p-8 text-left text-[11px] font-black text-gris uppercase tracking-[0.2em]">Fecha y Hora</th>
                        <th className="p-8 text-left text-[11px] font-black text-gris uppercase tracking-[0.2em]">Usuario</th>
                        <th className="p-8 text-left text-[11px] font-black text-gris uppercase tracking-[0.2em]">Acción / Evento</th>
                        <th className="p-8 text-left text-[11px] font-black text-gris uppercase tracking-[0.2em]">Detalle</th>
                        <th className="p-8 text-left text-[11px] font-black text-gris uppercase tracking-[0.2em]">Módulo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredActivities.map(act => (
                        <tr key={act.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-8">
                             <div className="text-sm font-black text-texto">{act.date}</div>
                             <div className="text-[10px] font-bold text-gris uppercase tracking-widest mt-0.5">Operación TBS</div>
                          </td>
                          <td className="p-8">
                             <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center text-[10px] font-black text-texto border border-gray-100">
                                   {act.userName.charAt(0)}
                                </div>
                                <span className="font-black text-sm text-texto">{act.userName}</span>
                             </div>
                          </td>
                          <td className="p-8">
                             <span className="px-3 py-1.5 bg-gray-100 rounded-lg text-[11px] font-black text-texto-sec uppercase tracking-wider">{act.action}</span>
                          </td>
                          <td className="p-8">
                             <p className="text-sm font-medium text-gris leading-relaxed max-w-sm">{act.detail}</p>
                          </td>
                          <td className="p-8">
                             <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-rojo/5 text-rojo rounded-md">
                                   {act.module === 'usuarios' && <Users size={14} />}
                                   {act.module === 'pedidos' && <ShoppingCart size={14} />}
                                   {act.module === 'cartera' && <Wallet size={14} />}
                                   {act.module === 'pagos' && <CreditCard size={14} />}
                                </div>
                                <span className="text-[10px] font-black text-rojo uppercase tracking-widest">{act.module}</span>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-10 border-t border-gray-50 flex justify-center">
                   <button 
                     onClick={() => {
                       onCreateNotification({
                         id: Date.now(),
                         title: "Fin del Registro",
                         message: "Has cargado todas las actividades disponibles para el periodo actual.",
                         type: "info",
                         time: "Ahora",
                         icon: "AlertCircle",
                         read: false
                       });
                     }}
                     className="px-8 py-4 border-2 border-gray-200 text-gris hover:border-rojo hover:border-rojo rounded-2xl font-black text-sm uppercase tracking-widest transition-all cursor-pointer"
                   >
                      Cargar más actividades
                   </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER ESPACIO */}
      <div className="h-20" />

      {/* MODAL CREAR USUARIO */}
      <AnimatePresence>
        {isUserModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUserModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl z-10 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-rojo text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rojo/20">
                    {editingUser ? <Edit2 size={24} /> : <UserPlus size={24} />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-texto tracking-tight">
                      {editingUser ? 'Editar Perfil de Usuario' : 'Crear Nuevo Usuario'}
                    </h2>
                    <p className="text-sm font-semibold text-gris uppercase tracking-tight">
                      {editingUser ? 'Actualiza los permisos y accesos del colaborador' : 'Invita a un colaborador a tu cuenta corporativa'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={handleCloseModal}
                  className="w-12 h-12 bg-white text-gris hover:text-rojo rounded-xl flex items-center justify-center transition-all border border-borde shadow-sm"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* Left Column: Info Básica */}
                  <div className="space-y-8">
                    <div className="space-y-6">
                      <h3 className="text-lg font-black text-texto flex items-center gap-2">
                        <Users size={20} className="text-rojo" /> Información Básica
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[11px] font-black uppercase tracking-widest text-gris px-1">Nombre Completo *</label>
                          <input 
                            type="text" 
                            value={newUserForm.name}
                            onChange={(e) => setNewUserForm(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Ej. Juan Pérez"
                            className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-rojo focus:bg-white rounded-2xl px-6 text-sm font-bold transition-all outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[11px] font-black uppercase tracking-widest text-gris px-1">Correo Electrónico *</label>
                          <input 
                            type="email" 
                            value={newUserForm.email}
                            onChange={(e) => setNewUserForm(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="juan.perez@empresa.com"
                            className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-rojo focus:bg-white rounded-2xl px-6 text-sm font-bold transition-all outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[11px] font-black uppercase tracking-widest text-gris px-1">Cargo / Rol *</label>
                          <div className="grid grid-cols-2 gap-3">
                            {['administrador', 'comprador', 'aprobador', 'finanzas', 'consulta'].map((role) => (
                              <button
                                key={role}
                                onClick={() => handleRoleChange(role as ClientAccountRole)}
                                className={`py-4 rounded-xl text-[11px] font-black uppercase tracking-widest border-2 transition-all ${
                                  newUserForm.role === role 
                                  ? 'bg-rojo border-rojo text-white shadow-lg shadow-rojo/20' 
                                  : 'bg-white border-gray-100 text-gris hover:border-gray-200'
                                }`}
                              >
                                {getRoleLabel(role as any)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-lg font-black text-texto flex items-center gap-2 border-t border-gray-50 pt-8">
                        <Building2 size={20} className="text-rojo" /> Jurisdicción (Sedes y Sucursales)
                      </h3>
                      
                      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {companyAccount.cities.map(city => (
                          <div key={city.id} className="space-y-2">
                            <button
                              onClick={() => toggleCity(city.id)}
                              className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                                newUserForm.assignedCityIds.includes(city.id)
                                ? 'bg-rojo/5 border-rojo'
                                : 'bg-white border-gray-100 hover:border-gray-200'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                                  newUserForm.assignedCityIds.includes(city.id) ? 'bg-rojo text-white' : 'bg-gray-100 text-transparent'
                                }`}>
                                  <Check size={14} strokeWidth={4} />
                                </div>
                                <span className="text-xs font-black text-texto uppercase tracking-tight">{city.name}</span>
                              </div>
                              <span className="text-[10px] font-bold text-gris uppercase">{companyAccount.branches.filter(b => b.cityId === city.id).length} sedes</span>
                            </button>

                            {newUserForm.assignedCityIds.includes(city.id) && (
                              <div className="pl-6 grid grid-cols-1 gap-2">
                                {companyAccount.branches.filter(b => b.cityId === city.id).map(branch => (
                                  <button
                                    key={branch.id}
                                    onClick={() => toggleBranch(branch.id, city.id)}
                                    className={`flex items-center gap-3 p-2.5 rounded-lg border-2 transition-all ${
                                      newUserForm.assignedBranchIds.includes(branch.id)
                                      ? 'bg-white border-rojo/40 text-rojo'
                                      : 'bg-white border-transparent text-gris hover:bg-gray-50'
                                    }`}
                                  >
                                    <div className={`w-4 h-4 rounded-md flex items-center justify-center transition-all ${
                                      newUserForm.assignedBranchIds.includes(branch.id) ? 'bg-rojo text-white' : 'bg-gray-200 text-transparent'
                                    }`}>
                                      <Check size={12} strokeWidth={4} />
                                    </div>
                                    <span className="text-[11px] font-bold truncate">{branch.name}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] font-bold text-gris px-1 uppercase tracking-tight opacity-60">
                        {newUserForm.role === 'master' || newUserForm.role === 'administrador' 
                          ? 'Los roles Master y Administrador tienen acceso global por defecto.' 
                          : 'Asigna al menos una ciudad para habilitar la creación.'}
                      </p>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-lg font-black text-texto flex items-center gap-2 border-t border-gray-50 pt-8">
                        <Target size={20} className="text-rojo" /> Límites y Alcance
                      </h3>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-gris px-1">Límite de Compra Mensual (Opcional)</label>
                        <div className="relative">
                          <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-gris">$</span>
                          <input 
                            type="number" 
                            value={newUserForm.purchaseLimit}
                            onChange={(e) => setNewUserForm(prev => ({ ...prev, purchaseLimit: e.target.value }))}
                            placeholder="0.00"
                            className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-rojo focus:bg-white rounded-2xl pl-12 pr-6 text-sm font-black transition-all outline-none"
                          />
                        </div>
                        <p className="text-[10px] font-bold text-gris px-1 uppercase tracking-tight mt-1 opacity-60">Si se deja en 0, no tendrá límite propio.</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Permisos */}
                  <div className="bg-gray-50/50 rounded-[32px] border border-gray-100 p-8">
                    <h3 className="text-lg font-black text-texto flex items-center gap-2 mb-6">
                      <ShieldCheck size={20} className="text-rojo" /> Permisos Específicos
                    </h3>
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                      {permissions.map((perm) => (
                        <button
                          key={perm.key}
                          onClick={() => togglePermission(perm.key)}
                          className={`w-full p-4 rounded-2xl flex items-center justify-between border-2 transition-all ${
                            newUserForm.permissions.includes(perm.key)
                            ? 'bg-white border-rojo shadow-sm'
                            : 'bg-white/40 border-transparent hover:border-gray-200'
                          }`}
                        >
                          <div className="text-left">
                            <div className="text-xs font-black text-texto mb-0.5">{perm.label}</div>
                            <div className="text-[10px] font-medium text-gris leading-tight">{perm.description}</div>
                          </div>
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                            newUserForm.permissions.includes(perm.key)
                            ? 'bg-rojo text-white'
                            : 'bg-gray-100 text-transparent'
                          }`}>
                            <Check size={16} strokeWidth={4} />
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="mt-6 p-4 bg-rojo/5 rounded-2xl border border-rojo/10">
                       <p className="text-[10px] font-bold text-rojo leading-relaxed uppercase tracking-wider text-center">
                          Los permisos se han pre-configurado según el cargo seleccionado, pero puedes ajustarlos libremente.
                       </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-gray-100 bg-white flex items-center justify-between gap-6">
                <button 
                  onClick={handleCloseModal}
                  className="px-8 py-4 text-sm font-black text-gris uppercase tracking-widest hover:text-texto transition-all"
                >
                  Cancelar
                </button>
                <button 
                  disabled={!isFormValid}
                  onClick={handleSubmitUser}
                  className={`px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.15em] transition-all flex items-center gap-3 tbs-shadow ${
                    isFormValid 
                    ? 'bg-rojo text-white hover:bg-rojo-oscuro shadow-lg shadow-rojo/20' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
                  }`}
                >
                  {editingUser ? <Edit2 size={20} /> : <UserPlus size={20} />}
                  {editingUser ? 'Guardar Cambios' : 'Crear y enviar invitación'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* MODAL CREAR/EDITAR CIUDAD */}
      <AnimatePresence>
        {isCityModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCityModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl z-10 overflow-hidden"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-rojo text-white rounded-2xl flex items-center justify-center">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-texto tracking-tight">
                      {editingCity ? 'Editar Ciudad' : 'Nueva Ciudad / Sede'}
                    </h2>
                    <p className="text-sm font-bold text-gris uppercase tracking-tight">Estructura Corporativa</p>
                  </div>
                </div>
                <button onClick={() => setIsCityModalOpen(false)} className="w-10 h-10 flex items-center justify-center text-gris hover:text-rojo"><X size={24} /></button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gris px-1">Nombre de la Ciudad / Región</label>
                  <input 
                    type="text" 
                    value={cityForm.name}
                    onChange={(e) => setCityForm({ name: e.target.value })}
                    placeholder="Ej. Bogotá, D.C."
                    className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-rojo focus:bg-white rounded-2xl px-6 text-sm font-bold transition-all outline-none"
                  />
                </div>
              </div>
              <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex gap-4">
                <button onClick={() => setIsCityModalOpen(false)} className="flex-1 py-4 text-sm font-black text-gris uppercase tracking-widest">Cancelar</button>
                <button 
                  onClick={handleSubmitCity}
                  className="flex-[2] py-4 bg-rojo text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-rojo-oscuro transition-all tbs-shadow"
                >
                  {editingCity ? 'Guardar Cambios' : 'Crear Ciudad'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL CREAR/EDITAR SUCURSAL */}
      <AnimatePresence>
        {isBranchModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBranchModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl z-10 overflow-hidden"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-rojo text-white rounded-2xl flex items-center justify-center">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-texto tracking-tight">
                      {editingBranch ? 'Editar Sucursal' : 'Nueva Sucursal'}
                    </h2>
                    <p className="text-sm font-bold text-gris uppercase tracking-tight">Gestión de Puntos de Venta</p>
                  </div>
                </div>
                <button onClick={() => setIsBranchModalOpen(false)} className="w-10 h-10 flex items-center justify-center text-gris hover:text-rojo"><X size={24} /></button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gris px-1">Nombre de la Sucursal</label>
                  <input 
                    type="text" 
                    value={branchForm.name}
                    onChange={(e) => setBranchForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ej. Restaurante Sede Norte"
                    className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-rojo focus:bg-white rounded-2xl px-6 text-sm font-bold transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gris px-1">Dirección Exacta</label>
                  <input 
                    type="text" 
                    value={branchForm.address}
                    onChange={(e) => setBranchForm(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Ej. Calle 100 # 15-20"
                    className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-rojo focus:bg-white rounded-2xl px-6 text-sm font-bold transition-all outline-none"
                  />
                </div>
              </div>
              <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex gap-4">
                <button onClick={() => setIsBranchModalOpen(false)} className="flex-1 py-4 text-sm font-black text-gris uppercase tracking-widest">Cancelar</button>
                <button 
                  onClick={handleSubmitBranch}
                  className="flex-[2] py-4 bg-rojo text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-rojo-oscuro transition-all tbs-shadow"
                >
                  {editingBranch ? 'Guardar Cambios' : 'Crear Sucursal'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* MODAL REGLA DE APROBACIÓN */}
      <AnimatePresence>
        {isRuleModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRuleModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl z-10 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-rojo text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rojo/20">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-texto tracking-tight">
                      {editingRule ? 'Editar Regla de Aprobación' : 'Nueva Regla de Aprobación'}
                    </h2>
                    <p className="text-sm font-semibold text-gris uppercase tracking-tight">
                      Configura las condiciones de validación para pedidos
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsRuleModalOpen(false)}
                  className="w-12 h-12 bg-white text-gris hover:text-rojo rounded-xl flex items-center justify-center transition-all border border-borde shadow-sm cursor-pointer"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-8">
                <div className="space-y-6">
                  <h3 className="text-lg font-black text-texto flex items-center gap-2">
                    <Edit2 size={20} className="text-rojo" /> Configuración General
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-gris px-1">Nombre de la Regla *</label>
                      <input 
                        type="text" 
                        value={ruleForm.name}
                        onChange={(e) => setRuleForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ej. Aprobación Pedidos Mayores a $5.000.000"
                        className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-rojo focus:bg-white rounded-2xl px-6 text-sm font-bold transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-gris px-1">Descripción</label>
                      <textarea 
                        value={ruleForm.description}
                        onChange={(e) => setRuleForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Explica cuándo se aplica esta regla..."
                        className="w-full h-28 bg-gray-50 border-2 border-transparent focus:border-rojo focus:bg-white rounded-2xl p-6 text-sm font-medium transition-all outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-lg font-black text-texto flex items-center gap-2">
                      <CreditCard size={20} className="text-rojo" /> Condición de Monto
                    </h3>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-gris px-1">Monto Mínimo *</label>
                      <div className="relative">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-gris">$</span>
                        <input 
                          type="number" 
                          value={ruleForm.minAmount}
                          onChange={(e) => setRuleForm(prev => ({ ...prev, minAmount: e.target.value }))}
                          placeholder="0"
                          className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-rojo focus:bg-white rounded-2xl pl-12 pr-6 text-sm font-black transition-all outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-black text-texto flex items-center gap-2">
                      <Users size={20} className="text-rojo" /> Aplicar a Rol
                    </h3>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-gris px-1">Seleccionar Cargo (Opcional)</label>
                      <select 
                        value={ruleForm.appliesToRole}
                        onChange={(e) => setRuleForm(prev => ({ ...prev, appliesToRole: e.target.value as any }))}
                        className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-rojo focus:bg-white rounded-2xl px-6 text-sm font-bold transition-all outline-none appearance-none cursor-pointer"
                      >
                        <option value="">Todos los cargos</option>
                        <option value="comprador">Comprador</option>
                        <option value="aprobador">Aprobador</option>
                        <option value="finanzas">Finanzas</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-black text-texto flex items-center gap-2 border-t border-gray-50 pt-8">
                    <CheckCircle2 size={20} className="text-rojo" /> Designar Aprobadores
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                    {companyAccount.users.filter(u => u.role === 'administrador' || u.role === 'master' || u.role === 'aprobador').map(user => (
                      <button
                        key={user.id}
                        onClick={() => {
                          const alreadySelected = ruleForm.approverUserIds.includes(user.id);
                          setRuleForm(prev => ({
                            ...prev,
                            approverUserIds: alreadySelected 
                              ? prev.approverUserIds.filter(id => id !== user.id)
                              : [...prev.approverUserIds, user.id]
                          }));
                        }}
                        className={`p-4 rounded-xl flex items-center gap-4 border-2 transition-all ${
                          ruleForm.approverUserIds.includes(user.id)
                          ? 'bg-rojo/5 border-rojo shadow-sm'
                          : 'bg-white border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs ${
                          ruleForm.approverUserIds.includes(user.id) ? 'bg-rojo text-white' : 'bg-gray-100 text-texto'
                        }`}>
                          {user.name.charAt(0)}
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-black text-texto leading-none">{user.name}</div>
                          <div className="text-[10px] font-bold text-gris uppercase tracking-tight mt-1">{getRoleLabel(user.role)}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-black text-texto flex items-center gap-2 border-t border-gray-50 pt-8">
                    <MapPin size={20} className="text-rojo" /> Alcance Geográfico
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {companyAccount.cities.map(city => (
                      <button
                        key={city.id}
                        onClick={() => {
                          const alreadySelected = ruleForm.appliesToCityIds.includes(city.id);
                          setRuleForm(prev => ({
                            ...prev,
                            appliesToCityIds: alreadySelected 
                              ? prev.appliesToCityIds.filter(id => id !== city.id)
                              : [...prev.appliesToCityIds, city.id]
                          }));
                        }}
                        className={`px-5 py-3 rounded-xl border-2 font-black text-xs uppercase tracking-widest transition-all ${
                          ruleForm.appliesToCityIds.includes(city.id)
                          ? 'bg-rojo text-white border-rojo'
                          : 'bg-white border-gray-100 text-gris hover:border-gray-200'
                        }`}
                      >
                        {city.name}
                      </button>
                    ))}
                    <button
                      onClick={() => setRuleForm(prev => ({ ...prev, appliesToCityIds: [] }))}
                      className={`px-5 py-3 rounded-xl border-2 font-black text-xs uppercase tracking-widest transition-all ${
                        ruleForm.appliesToCityIds.length === 0
                        ? 'bg-rojo text-white border-rojo'
                        : 'bg-white border-gray-100 text-gris hover:border-gray-200'
                      }`}
                    >
                      Todas las ciudades
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-gray-100 bg-white flex items-center justify-between gap-6">
                <button 
                  onClick={() => setIsRuleModalOpen(false)}
                  className="px-8 py-4 text-sm font-black text-gris uppercase tracking-widest hover:text-texto transition-all"
                >
                  Cancelar
                </button>
                <button 
                  disabled={!ruleForm.name.trim() || !ruleForm.minAmount || ruleForm.approverUserIds.length === 0}
                  onClick={handleSubmitRule}
                  className={`px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.15em] transition-all flex items-center gap-3 tbs-shadow ${
                    ruleForm.name.trim() && ruleForm.minAmount && ruleForm.approverUserIds.length > 0
                    ? 'bg-rojo text-white hover:bg-rojo-oscuro shadow-lg shadow-rojo/20' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
                  }`}
                >
                  {editingRule ? <Edit2 size={20} /> : <Plus size={20} />}
                  {editingRule ? 'Guardar Cambios' : 'Activar Regla'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
