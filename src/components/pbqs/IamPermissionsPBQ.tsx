import React, { useState } from 'react';
import {
  IamUserGroupConfig,
  FolderPermissionNode,
  FolderAclEntry,
} from '../../types/pbq';
import {
  Users,
  FolderTree,
  Shield,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  UserCheck,
  UserX,
  Lock,
  Unlock,
  Key,
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface Props {
  userGroups: IamUserGroupConfig[];
  folderNodes: FolderPermissionNode[];
  onUserGroupsChange: (newUsers: IamUserGroupConfig[]) => void;
  onFoldersChange: (newFolders: FolderPermissionNode[]) => void;
  onReset: () => void;
}

export const IamPermissionsPBQ: React.FC<Props> = ({
  userGroups,
  folderNodes,
  onUserGroupsChange,
  onFoldersChange,
  onReset,
}) => {
  const [selectedFolderIdx, setSelectedFolderIdx] = useState<number>(0);
  const activeFolder = folderNodes[selectedFolderIdx];

  const toggleUserGroup = (username: string, groupName: string) => {
    sound.playToggle();
    const updated = userGroups.map((u) => {
      if (u.username === username) {
        const hasGroup = u.assignedGroups.includes(groupName);
        const newGroups = hasGroup
          ? u.assignedGroups.filter((g) => g !== groupName)
          : [...u.assignedGroups, groupName];
        return { ...u, assignedGroups: newGroups };
      }
      return u;
    });
    onUserGroupsChange(updated);
  };

  const toggleFolderInheritance = (folderIdx: number) => {
    sound.playToggle();
    const updated = [...folderNodes];
    const target = updated[folderIdx];
    const newInheritance = !target.inheritanceEnabled;

    let newAcl = [...target.currentAcl];
    // If disabling inheritance, remove inherited flags or drop inherited entries
    if (!newInheritance) {
      newAcl = newAcl.filter((a) => !a.principalName.includes('Domain Users'));
    }

    updated[folderIdx] = {
      ...target,
      inheritanceEnabled: newInheritance,
      currentAcl: newAcl,
    };
    onFoldersChange(updated);
  };

  const toggleAclPermission = (
    folderIdx: number,
    principalName: string,
    permField: 'read' | 'write' | 'modify' | 'fullControl'
  ) => {
    sound.playClick();
    const updated = [...folderNodes];
    const folder = updated[folderIdx];

    const newAcl = folder.currentAcl.map((entry) => {
      if (entry.principalName === principalName) {
        const val = !entry[permField];
        const newEntry = { ...entry, [permField]: val };

        // If Full Control turned on, auto enable read, write, modify
        if (permField === 'fullControl' && val) {
          newEntry.read = true;
          newEntry.write = true;
          newEntry.modify = true;
        }
        // If modify turned on, ensure read & write are enabled
        if (permField === 'modify' && val) {
          newEntry.read = true;
          newEntry.write = true;
        }
        return newEntry;
      }
      return entry;
    });

    updated[folderIdx] = { ...folder, currentAcl: newAcl };
    onFoldersChange(updated);
  };

  const addPrincipalToAcl = (folderIdx: number, principalName: string) => {
    sound.playClick();
    const updated = [...folderNodes];
    const folder = updated[folderIdx];
    if (folder.currentAcl.some((a) => a.principalName === principalName)) return;

    const newEntry: FolderAclEntry = {
      principalName,
      type: 'group',
      read: true,
      write: false,
      modify: false,
      fullControl: false,
      inherited: false,
    };

    updated[folderIdx] = {
      ...folder,
      currentAcl: [...folder.currentAcl, newEntry],
    };
    onFoldersChange(updated);
  };

  const removePrincipalFromAcl = (folderIdx: number, principalName: string) => {
    sound.playToggle();
    const updated = [...folderNodes];
    const folder = updated[folderIdx];
    updated[folderIdx] = {
      ...folder,
      currentAcl: folder.currentAcl.filter((a) => a.principalName !== principalName),
    };
    onFoldersChange(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-200">
              Administrador de Identidades y Listas de Control de Acceso (IAM & NTFS ACLs)
            </h4>
            <p className="text-xs text-slate-400">
              Ajusta membresías de grupos y listas de control de acceso para garantizar el <strong>Principio de Mínimo Privilegio (Least Privilege)</strong>.
            </p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Restablecer
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SECTION 1: User Group Assignments (RBAC) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-sm font-semibold text-slate-200">
            <Users className="w-4 h-4 text-cyan-400" />
            <span>Asignación de Grupos de Usuarios (RBAC)</span>
          </div>

          <div className="space-y-4">
            {userGroups.map((user) => {
              const isIntern = user.username === 'intern_marcos';
              const isAuditor = user.username === 'auditor_valeria';

              return (
                <div
                  key={user.username}
                  className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white font-mono">
                        {user.username}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {user.role}
                      </div>
                    </div>
                  </div>

                  {/* Available Group Badges Toggle */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                      Grupos Asignados:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {['IT_Helpdesk', 'HR_Confidential_Admins', 'Finance_Team', 'Finance_Auditors'].map(
                        (grp) => {
                          const isAssigned = user.assignedGroups.includes(grp);
                          const isTrapGroup = isIntern && grp === 'HR_Confidential_Admins';

                          return (
                            <button
                              key={grp}
                              onClick={() => toggleUserGroup(user.username, grp)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                                isAssigned
                                  ? isTrapGroup
                                    ? 'bg-rose-950 text-rose-300 border border-rose-700 font-bold'
                                    : 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                                  : 'bg-slate-900 text-slate-500 border border-slate-800 hover:text-slate-300'
                              }`}
                            >
                              {isAssigned ? (
                                <UserCheck className="w-3.5 h-3.5" />
                              ) : (
                                <UserX className="w-3.5 h-3.5" />
                              )}
                              <span>{grp}</span>
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>

                  {isIntern && user.assignedGroups.includes('HR_Confidential_Admins') && (
                    <div className="flex items-center gap-1.5 text-[11px] text-rose-400 bg-rose-950/40 p-2 rounded-lg border border-rose-800/60">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>¡Violación de Seguridad! El practicante tiene acceso al grupo de administradores de RRHH.</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: Folder ACLs & Inheritance */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
              <FolderTree className="w-4 h-4 text-cyan-400" />
              <span>Permisos NTFS de Carpetas Compartidas</span>
            </div>

            {/* Folder Selector Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800">
              {folderNodes.map((folder, idx) => (
                <button
                  key={folder.path}
                  onClick={() => {
                    sound.playClick();
                    setSelectedFolderIdx(idx);
                  }}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    selectedFolderIdx === idx
                      ? 'bg-cyan-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {idx === 0 ? 'HR / Nómina' : 'Finanzas'}
                </button>
              ))}
            </div>
          </div>

          {/* Active Folder Info & Inheritance Switch */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-xs font-mono font-bold text-white">
                  {activeFolder.path}
                </div>
                <div className="text-[11px] text-slate-400">
                  {activeFolder.description}
                </div>
              </div>

              {/* Inheritance Toggle Button */}
              <button
                onClick={() => toggleFolderInheritance(selectedFolderIdx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors flex items-center gap-1.5 ${
                  activeFolder.inheritanceEnabled
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}
              >
                {activeFolder.inheritanceEnabled ? (
                  <>
                    <Unlock className="w-3.5 h-3.5" /> Herencia ACTIVADA
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" /> Herencia DESHABILITADA (Seguro)
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ACL Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/40">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-slate-400 border-b border-slate-800 text-[10px] font-semibold uppercase">
                  <th className="py-2.5 px-3">Entidad / Grupo</th>
                  <th className="py-2.5 px-2 text-center">Lectura</th>
                  <th className="py-2.5 px-2 text-center">Escritura</th>
                  <th className="py-2.5 px-2 text-center">Modificar</th>
                  <th className="py-2.5 px-2 text-center">Control Total</th>
                  <th className="py-2.5 px-2 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {activeFolder.currentAcl.map((entry) => {
                  const isEveryone = entry.principalName.includes('Domain Users');

                  return (
                    <tr
                      key={entry.principalName}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isEveryone ? 'bg-rose-950/20' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-white">
                          {entry.principalName}
                        </div>
                        {entry.inherited && (
                          <div className="text-[10px] text-amber-400 font-sans">
                            (Heredado de carpeta raíz)
                          </div>
                        )}
                      </td>

                      {/* Read */}
                      <td className="py-2.5 px-2 text-center">
                        <input
                          type="checkbox"
                          checked={entry.read}
                          onChange={() =>
                            toggleAclPermission(
                              selectedFolderIdx,
                              entry.principalName,
                              'read'
                            )
                          }
                          className="w-4 h-4 rounded text-cyan-600 focus:ring-0 bg-slate-800 border-slate-700"
                        />
                      </td>

                      {/* Write */}
                      <td className="py-2.5 px-2 text-center">
                        <input
                          type="checkbox"
                          checked={entry.write}
                          onChange={() =>
                            toggleAclPermission(
                              selectedFolderIdx,
                              entry.principalName,
                              'write'
                            )
                          }
                          className="w-4 h-4 rounded text-cyan-600 focus:ring-0 bg-slate-800 border-slate-700"
                        />
                      </td>

                      {/* Modify */}
                      <td className="py-2.5 px-2 text-center">
                        <input
                          type="checkbox"
                          checked={entry.modify}
                          onChange={() =>
                            toggleAclPermission(
                              selectedFolderIdx,
                              entry.principalName,
                              'modify'
                            )
                          }
                          className="w-4 h-4 rounded text-cyan-600 focus:ring-0 bg-slate-800 border-slate-700"
                        />
                      </td>

                      {/* Full Control */}
                      <td className="py-2.5 px-2 text-center">
                        <input
                          type="checkbox"
                          checked={entry.fullControl}
                          onChange={() =>
                            toggleAclPermission(
                              selectedFolderIdx,
                              entry.principalName,
                              'fullControl'
                            )
                          }
                          className="w-4 h-4 rounded text-cyan-600 focus:ring-0 bg-slate-800 border-slate-700"
                        />
                      </td>

                      {/* Remove Button */}
                      <td className="py-2.5 px-2 text-center">
                        <button
                          onClick={() =>
                            removePrincipalFromAcl(
                              selectedFolderIdx,
                              entry.principalName
                            )
                          }
                          className="text-[10px] text-rose-400 hover:text-rose-300 underline font-sans"
                        >
                          Quitar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Add Principal Dropdown helper */}
          <div className="flex items-center gap-2 pt-2">
            <span className="text-xs text-slate-400">Agregar grupo a esta carpeta:</span>
            {['Finance_Auditors', 'HR_Managers'].map((grp) => {
              if (activeFolder.currentAcl.some((a) => a.principalName === grp))
                return null;

              return (
                <button
                  key={grp}
                  onClick={() => addPrincipalToAcl(selectedFolderIdx, grp)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 border border-slate-700"
                >
                  + {grp}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
