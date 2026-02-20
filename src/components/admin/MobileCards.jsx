import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Eye, Edit } from 'lucide-react';

const InfoRow = ({ label, children }) => (
  <div className="flex items-center justify-between gap-2 py-1.5">
    <span className="text-xs text-muted-foreground shrink-0">{label}</span>
    <div className="text-sm text-right truncate">{children}</div>
  </div>
);

const Card = ({ children, className = '' }) => (
  <div className={`rounded-lg border border-slate-700/60 bg-slate-900/40 p-4 space-y-1.5 ${className}`}>
    {children}
  </div>
);

const ActionButtons = ({ onApprove, onReject, loading }) => (
  <div className="flex gap-2 pt-2">
    <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700 text-white h-10" onClick={onApprove} disabled={loading}>
      <Check className="h-4 w-4 mr-1.5" /> Approve
    </Button>
    <Button size="sm" variant="destructive" className="flex-1 h-10" onClick={onReject} disabled={loading}>
      <X className="h-4 w-4 mr-1.5" /> Reject
    </Button>
  </div>
);

export const getStatusBadgeMobile = (status) => {
  switch (status?.toLowerCase()) {
    case 'approved': case 'win': case 'completed': return <Badge variant="success" className="bg-green-500 text-xs">{status}</Badge>;
    case 'pending': return <Badge variant="secondary" className="text-xs">{status}</Badge>;
    case 'rejected': case 'loss': return <Badge variant="destructive" className="text-xs">{status}</Badge>;
    default: return <Badge className="text-xs">{status || 'N/A'}</Badge>;
  }
};

export const UserCards = ({ users, getStatusBadge, onEdit }) => (
  <div className="space-y-3">
    {users.map(user => (
      <Card key={user.id}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm truncate">{user.first_name || 'N/A'} {user.last_name || ''}</p>
            <p className="text-xs text-muted-foreground truncate mt-0.5">{user.email}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {user.is_admin ? <Badge className="bg-purple-600 text-xs">Admin</Badge> : <Badge variant="outline" className="text-xs">User</Badge>}
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(user)}>
              <Edit className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">KYC</span>
            {getStatusBadge(user.kyc_status)}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Override</span>
            {user.trade_override_status ? getStatusBadge(user.trade_override_status) : <Badge variant="outline" className="text-xs">Off</Badge>}
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground pt-0.5">Joined {new Date(user.created_at).toLocaleDateString()}</p>
      </Card>
    ))}
  </div>
);

export const RequestCards = ({ items, type, getStatusBadge, onUpdateStatus, onViewProof, loading }) => (
  <div className="space-y-3">
    {items.map(item => (
      <Card key={item.id}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm truncate">{item.users?.first_name || 'N/A'} {item.users?.last_name || ''}</p>
            <p className="text-xs text-muted-foreground truncate mt-0.5">{item.users?.email}</p>
          </div>
          {getStatusBadge(item.status)}
        </div>
        <InfoRow label="Amount">
          <span className="font-semibold">{item.amount} {item.currency}</span>
        </InfoRow>
        {type === 'withdrawals' && item.wallet_address && (
          <InfoRow label="Address">
            <span className="text-xs font-mono truncate max-w-[160px] inline-block">{item.wallet_address}</span>
          </InfoRow>
        )}
        {type === 'deposits' && item.proof_url && (
          <Button variant="outline" size="sm" className="w-full h-9 mt-1" onClick={() => onViewProof(item.proof_url)}>
            <Eye className="h-3.5 w-3.5 mr-1.5" /> View Proof
          </Button>
        )}
        <p className="text-[10px] text-muted-foreground">{new Date(item.created_at).toLocaleString()}</p>
        {item.status === 'pending' && (
          <ActionButtons
            loading={loading}
            onApprove={() => onUpdateStatus(type, item.id, 'approved', { userId: item.user_id, amount: item.amount, currency: item.currency })}
            onReject={() => onUpdateStatus(type, item.id, 'rejected', { userId: item.user_id, amount: item.amount, currency: item.currency })}
          />
        )}
      </Card>
    ))}
  </div>
);

export const KYCCards = ({ users, getStatusBadge, onUpdateStatus, onViewDoc, loading }) => (
  <div className="space-y-3">
    {users.map(user => (
      <Card key={user.id}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm truncate">{user.first_name} {user.last_name}</p>
            <p className="text-xs text-muted-foreground truncate mt-0.5">{user.email || 'N/A'}</p>
          </div>
          {getStatusBadge(user.kyc_status)}
        </div>
        <InfoRow label="Country">{user.country || 'N/A'}</InfoRow>
        {user.id_document_url && (
          <Button variant="outline" size="sm" className="w-full h-9 mt-1" onClick={() => onViewDoc(user.id_document_url)}>
            <Eye className="h-3.5 w-3.5 mr-1.5" /> View Document
          </Button>
        )}
        {user.kyc_status === 'pending' && (
          <ActionButtons
            loading={loading}
            onApprove={() => onUpdateStatus('profiles', user.id, 'approved', { kyc: true })}
            onReject={() => onUpdateStatus('profiles', user.id, 'rejected', { kyc: true })}
          />
        )}
      </Card>
    ))}
  </div>
);

export const TradeSettingCards = ({ settings, onEdit }) => (
  <div className="space-y-3">
    {settings.map(setting => (
      <Card key={setting.id}>
        <div className="flex items-center justify-between">
          <p className="font-semibold text-sm">{setting.duration}s Duration</p>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(setting)}>
            <Edit className="h-3.5 w-3.5" />
          </Button>
        </div>
        <InfoRow label="Win Rate">{(setting.win_rate * 100).toFixed(2)}%</InfoRow>
        <InfoRow label="Loss Rate">{(setting.loss_rate * 100).toFixed(2)}%</InfoRow>
        <InfoRow label="Min Capital">{setting.min_capital}</InfoRow>
      </Card>
    ))}
  </div>
);
