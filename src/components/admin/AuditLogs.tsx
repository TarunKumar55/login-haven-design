import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Loader2, Search, FileText, User, Shield } from 'lucide-react';
import { format } from 'date-fns';

interface AuditLog {
  id: string;
  user_id: string;
  user_email: string;
  user_role: string;
  action: string;
  table_name: string;
  record_id: string;
  old_values: any;
  new_values: any;
  created_at: string;
}

const AuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    action: 'all',
    table: 'all',
    user: 'all',
    search: ''
  });

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case 'INSERT': return 'default';
      case 'UPDATE': return 'secondary';
      case 'DELETE': return 'destructive';
      default: return 'outline';
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'pg_owner': return 'secondary';
      case 'user': return 'outline';
      default: return 'outline';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'INSERT': return <FileText className="w-4 h-4" />;
      case 'UPDATE': return <FileText className="w-4 h-4" />;
      case 'DELETE': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesAction = filter.action === 'all' || log.action === filter.action;
    const matchesTable = filter.table === 'all' || log.table_name === filter.table;
    const matchesUser = filter.user === 'all' || log.user_role === filter.user;
    const matchesSearch = !filter.search || 
      log.user_email.toLowerCase().includes(filter.search.toLowerCase()) ||
      log.action.toLowerCase().includes(filter.search.toLowerCase()) ||
      log.table_name.toLowerCase().includes(filter.search.toLowerCase());
    
    return matchesAction && matchesTable && matchesUser && matchesSearch;
  });

  const uniqueUsers = [...new Set(logs.map(log => log.user_role))];
  const uniqueTables = [...new Set(logs.map(log => log.table_name))];

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Audit Logs
        </CardTitle>
        <div className="flex flex-wrap gap-4 pt-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            <Input
              placeholder="Search logs..."
              value={filter.search}
              onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
              className="w-64"
            />
          </div>
          
          <Select value={filter.action} onValueChange={(value) => setFilter(prev => ({ ...prev, action: value }))}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="INSERT">Insert</SelectItem>
              <SelectItem value="UPDATE">Update</SelectItem>
              <SelectItem value="DELETE">Delete</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filter.table} onValueChange={(value) => setFilter(prev => ({ ...prev, table: value }))}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Table" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tables</SelectItem>
              {uniqueTables.map(table => (
                <SelectItem key={table} value={table}>{table}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filter.user} onValueChange={(value) => setFilter(prev => ({ ...prev, user: value }))}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {uniqueUsers.map(role => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Table</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm">
                    {format(new Date(log.created_at), 'MMM dd, yyyy HH:mm:ss')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span className="text-sm">{log.user_email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(log.user_role)}>
                      {log.user_role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getActionIcon(log.action)}
                      <Badge variant={getActionBadgeVariant(log.action)}>
                        {log.action}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{log.table_name}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    {log.action === 'INSERT' && log.new_values && (
                      <div className="text-sm text-muted-foreground">
                        Created: {log.new_values.title || log.new_values.full_name || 'Record'}
                      </div>
                    )}
                    {log.action === 'UPDATE' && log.old_values && log.new_values && (
                      <div className="text-sm text-muted-foreground">
                        {Object.keys(log.new_values).filter(key => 
                          JSON.stringify(log.old_values[key]) !== JSON.stringify(log.new_values[key])
                        ).slice(0, 2).join(', ')} updated
                      </div>
                    )}
                    {log.action === 'DELETE' && log.old_values && (
                      <div className="text-sm text-muted-foreground">
                        Deleted: {log.old_values.title || log.old_values.full_name || 'Record'}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No audit logs found matching your filters.
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AuditLogs;