import { UserRole } from "@/contexts/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface RoleSelectProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  disabled?: boolean;
  loading?: boolean;
}

const RoleSelect = ({ currentRole, onRoleChange, disabled = false, loading = false }: RoleSelectProps) => {
  const roles: { value: UserRole; label: string; description: string }[] = [
    {
      value: 'user',
      label: 'User',
      description: 'Regular user with basic access'
    },
    {
      value: 'pg_owner',
      label: 'PG Owner',
      description: 'Can create and manage PG listings'
    },
    {
      value: 'admin',
      label: 'Admin',
      description: 'Full access to all features'
    }
  ];

  return (
    <div className="flex items-center gap-2">
      <Select
        value={currentRole}
        onValueChange={onRoleChange}
        disabled={disabled || loading}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {roles.map((role) => (
            <SelectItem key={role.value} value={role.value}>
              <div className="flex flex-col">
                <span className="font-medium">{role.label}</span>
                <span className="text-xs text-muted-foreground">{role.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
    </div>
  );
};

export default RoleSelect;