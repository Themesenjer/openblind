"use client";

import { useState, useEffect } from "react";
import { useAccessibility } from "@/features/accessibility/AccessibilityContext";
import VoiceCommandButton from "@/components/dashboard/VoiceCommandButton";
import { fetchWithAuth } from "@/lib/api";
import {
  UserIcon,
  MailIcon,
  CalendarIcon,
  PencilIcon,
  LockIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  CheckIcon,
  XIcon,
  EyeIcon,
  EyeOffIcon,
  SparklesIcon,
  HeadphonesIcon,
  MicIcon,
  BoxIcon,
} from "@/components/ui/icons";

export default function ProfilePage() {
  const { speakText } = useAccessibility();

  // User Profile State
  const [profile, setProfile] = useState({
    name: "Pablo Reyes",
    email: "usuario@openblind.com",
    registerDate: "21 de agosto, 2026",
    role: "Administrador",
    avatarInitials: "PR",
    isVerified: true,
  });

  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Edit Form State
  const [editForm, setEditForm] = useState({
    name: profile.name,
    email: profile.email,
  });

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // Quick Toggles State
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch Profile from Backend API on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetchWithAuth("/api/users/profile");
        const json = await res.json();
        if (json?.status === "Success" && json.data) {
          const u = json.data;
          const name = u.nombre || "Pablo Reyes";
          const email = u.email || "usuario@openblind.com";
          setProfile({
            name,
            email,
            registerDate: u.creado_en ? new Date(u.creado_en).toLocaleDateString("es-ES") : "21 de agosto, 2026",
            role: u.rol || "Administrador",
            avatarInitials: name.substring(0, 2).toUpperCase(),
            isVerified: true,
          });
          setEditForm({ name, email });
        }
      } catch (err) {
        console.warn("Could not fetch user profile from backend", err);
      }
    };
    fetchProfile();
  }, []);

  // Handle Edit Profile Save to Backend API
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.name.trim() || !editForm.email.trim()) return;

    try {
      const res = await fetchWithAuth("/api/users/profile", {
        method: "PUT",
        body: JSON.stringify({ nombre: editForm.name, email: editForm.email }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data?.speechMessage || data?.message || "Error al actualizar perfil");
        return;
      }
      const msg = data?.speechMessage || "Perfil actualizado correctamente";

      setProfile((prev) => ({
        ...prev,
        name: editForm.name,
        email: editForm.email,
        avatarInitials: editForm.name.substring(0, 2).toUpperCase(),
      }));

      setIsEditModalOpen(false);
      speakText(msg);
      showToast(msg);
    } catch {
      showToast("Error al conectar con el servidor Backend");
    }
  };

  // Handle Change Password Save to Backend API
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.currentPassword) {
      showToast("Ingresa tu contraseña actual");
      return;
    }
    if (!passwordForm.newPassword || passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast("Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await fetchWithAuth("/api/users/password", {
        method: "PUT",
        body: JSON.stringify({ actual: passwordForm.currentPassword, nueva: passwordForm.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data?.speechMessage || data?.message || "Error al cambiar la contraseña");
        return;
      }
      const msg = data?.speechMessage || "Contraseña modificada con éxito";

      setIsPasswordModalOpen(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      speakText(msg);
      showToast(msg);
    } catch {
      showToast("Error al conectar con el servidor Backend");
    }
  };

  // Calculate Password Strength
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { label: "", color: "bg-slate-200", percent: 0 };
    if (pwd.length < 6) return { label: "Débil", color: "bg-rose-500", percent: 33 };
    if (pwd.length < 10) return { label: "Media", color: "bg-amber-500", percent: 66 };
    return { label: "Fuerte", color: "bg-emerald-500", percent: 100 };
  };

  const pwdStrength = getPasswordStrength(passwordForm.newPassword);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] px-6 py-8 sm:px-10 sm:py-10 transition-colors" id="main-content" tabIndex={-1}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-slate-900 text-white px-5 py-3.5 shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-top-3"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <CheckIcon width={16} height={16} />
          </span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Main Profile Card Container (Centered & Styled matching Figma design) */}
      <div className="mx-auto max-w-3xl">
        {/* Header Avatar Badge Section */}
        <div className="flex flex-col items-center justify-center text-center">
          {/* Avatar Circle */}
          <div className="relative group">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#1d4ed8] via-[#2563eb] to-[#60a5fa] text-2xl font-black text-white shadow-xl shadow-blue-500/25 ring-4 ring-white dark:ring-slate-800 transition-transform group-hover:scale-105">
              {profile.avatarInitials}
            </div>
            <button
              type="button"
              onClick={() => {
                setIsEditModalOpen(true);
                speakText("Abrir edición de avatar y perfil");
              }}
              aria-label="Cambiar foto de perfil"
              className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-md border border-slate-200 dark:border-slate-700 hover:bg-blue-50 hover:text-[#2563eb] transition-all"
            >
              <PencilIcon width={16} height={16} />
            </button>
          </div>

          {/* User Name & Verification Status Badge */}
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {profile.name}
          </h1>

          {profile.isVerified && (
            <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 px-3.5 py-1 text-xs font-bold text-[#2563eb] dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40">
              <CheckCircleIcon width={15} height={15} className="text-[#2563eb] dark:text-blue-400" />
              <span>Usuario verificado</span>
            </div>
          )}
        </div>

        {/* User Information Display Fields Grid */}
        <div className="mt-8 space-y-4">
          {/* Item 1: NOMBRE COMPLETO */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Nombre Completo
            </span>
            <div className="mt-1 flex items-center gap-3">
              <UserIcon width={18} height={18} className="text-slate-400 dark:text-slate-500" />
              <p className="text-base font-semibold text-slate-900 dark:text-white">{profile.name}</p>
            </div>
          </div>

          {/* Item 2: CORREO ELECTRÓNICO */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Correo Electrónico
            </span>
            <div className="mt-1 flex items-center gap-3">
              <MailIcon width={18} height={18} className="text-slate-400 dark:text-slate-500" />
              <p className="text-base font-semibold text-slate-900 dark:text-white">{profile.email}</p>
            </div>
          </div>

          {/* Item 3: FECHA DE REGISTRO */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Fecha de Registro
            </span>
            <div className="mt-1 flex items-center gap-3">
              <CalendarIcon width={18} height={18} className="text-slate-400 dark:text-slate-500" />
              <p className="text-base font-semibold text-slate-900 dark:text-white">{profile.registerDate}</p>
            </div>
          </div>

          {/* Item 4: ROL */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Rol
            </span>
            <div className="mt-1 flex items-center gap-3">
              <ShieldCheckIcon width={18} height={18} className="text-slate-400 dark:text-slate-500" />
              <p className="text-base font-semibold text-slate-900 dark:text-white">{profile.role}</p>
            </div>
          </div>
        </div>

        {/* Primary Actions: Editar Perfil & Cambiar Contraseña */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <button
            type="button"
            onClick={() => {
              setEditForm({ name: profile.name, email: profile.email });
              setIsEditModalOpen(true);
              speakText("Abrir formulario de edición de perfil");
            }}
            className="flex w-full sm:w-1/2 items-center justify-center gap-2.5 rounded-2xl bg-[#2563eb] py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-blue-600/35 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400"
          >
            <PencilIcon width={18} height={18} />
            <span>Editar perfil</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsPasswordModalOpen(true);
              speakText("Abrir cambio de contraseña");
            }}
            className="flex w-full sm:w-1/2 items-center justify-center gap-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 text-sm font-semibold text-slate-800 dark:text-slate-200 shadow-2xs transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/80 focus:outline-none focus-visible:ring-3 focus-visible:ring-slate-400"
          >
            <LockIcon width={18} height={18} />
            <span>Cambiar contraseña</span>
          </button>
        </div>

        {/* Interactive Activity & Statistics Summary Dashboard Section */}
        <div className="mt-10 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <SparklesIcon width={20} height={20} className="text-[#2563eb]" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Estadísticas y Actividad Adaptativa</h2>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Stat 1 */}
            <div className="rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 p-4 border border-blue-100 dark:border-blue-900/40">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <BoxIcon width={18} height={18} />
                <span className="text-xs font-bold uppercase tracking-wider">Módulos</span>
              </div>
              <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">12 / 15</p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-blue-200 dark:bg-blue-900">
                <div className="h-full bg-[#2563eb] rounded-full" style={{ width: "80%" }} />
              </div>
              <p className="mt-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">80% completado</p>
            </div>

            {/* Stat 2 */}
            <div className="rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 p-4 border border-emerald-100 dark:border-emerald-900/40">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <HeadphonesIcon width={18} height={18} />
                <span className="text-xs font-bold uppercase tracking-wider">Lectura</span>
              </div>
              <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">14.5 hrs</p>
              <p className="mt-3 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span>🔥</span> Racha activa de 5 días
              </p>
            </div>

            {/* Stat 3 */}
            <div className="rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 p-4 border border-purple-100 dark:border-purple-900/40">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <MicIcon width={18} height={18} />
                <span className="text-xs font-bold uppercase tracking-wider">Comandos</span>
              </div>
              <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">84 ejecutados</p>
              <p className="mt-3 text-[11px] font-medium text-slate-500 dark:text-slate-400">Voz accesibilidad activa</p>
            </div>
          </div>
        </div>

        {/* Quick Preference Toggles Card */}
        <div className="mt-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Preferencias de cuenta</h2>

          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Alertas por correo electrónico</p>
                <p className="text-[11px] text-slate-500">Recibe resúmenes semanales de aprendizaje y novedades</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={emailAlerts}
                onClick={() => {
                  setEmailAlerts(!emailAlerts);
                  speakText(emailAlerts ? "Alertas por correo desactivadas" : "Alertas por correo activadas");
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                  emailAlerts ? "bg-[#2563eb]" : "bg-slate-300 dark:bg-slate-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform ${
                    emailAlerts ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <hr className="border-slate-100 dark:border-slate-800" />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Sonidos de confirmación de interfaz</p>
                <p className="text-[11px] text-slate-500">Emitir tono al ejecutar comandos de voz y guardar datos</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={soundAlerts}
                onClick={() => {
                  setSoundAlerts(!soundAlerts);
                  speakText(soundAlerts ? "Sonidos de interfaz desactivados" : "Sonidos de interfaz activados");
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                  soundAlerts ? "bg-[#2563eb]" : "bg-slate-300 dark:bg-slate-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform ${
                    soundAlerts ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Modal 1: Editar Perfil */}
      {isEditModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-profile-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in"
        >
          <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-slate-900 dark:text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 id="edit-profile-title" className="text-lg font-bold">
                Editar datos de perfil
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                aria-label="Cerrar modal"
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <XIcon width={20} height={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-4 space-y-4">
              <div>
                <label htmlFor="edit-name" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Nombre completo
                </label>
                <input
                  id="edit-name"
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                  className="mt-1.5 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm font-medium focus:border-[#2563eb] focus:outline-none focus:ring-3 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label htmlFor="edit-email" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Correo electrónico
                </label>
                <input
                  id="edit-email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  required
                  className="mt-1.5 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm font-medium focus:border-[#2563eb] focus:outline-none focus:ring-3 focus:ring-blue-500/20"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 px-5 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#2563eb] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700"
                >
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interactive Modal 2: Cambiar Contraseña */}
      {isPasswordModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="change-password-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in"
        >
          <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-slate-900 dark:text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 id="change-password-title" className="text-lg font-bold">
                Cambiar contraseña
              </h3>
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                aria-label="Cerrar modal"
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <XIcon width={20} height={20} />
              </button>
            </div>

            <form onSubmit={handleSavePassword} className="mt-4 space-y-4">
              <div>
                <label htmlFor="current-pwd" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Contraseña actual
                </label>
                <input
                  id="current-pwd"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  required
                  className="mt-1.5 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm font-medium focus:border-[#2563eb] focus:outline-none focus:ring-3 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="new-pwd" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Nueva contraseña
                  </label>
                  {pwdStrength.label && (
                    <span className="text-[11px] font-bold text-slate-500">
                      Fortaleza: <span className="text-[#2563eb]">{pwdStrength.label}</span>
                    </span>
                  )}
                </div>

                <div className="relative mt-1.5">
                  <input
                    id="new-pwd"
                    type={showPassword ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required
                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-4 pr-12 py-3 text-sm font-medium focus:border-[#2563eb] focus:outline-none focus:ring-3 focus:ring-blue-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOffIcon width={18} height={18} /> : <EyeIcon width={18} height={18} />}
                  </button>
                </div>

                {/* Password Strength Meter Bar */}
                {passwordForm.newPassword && (
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className={`h-full transition-all duration-300 ${pwdStrength.color}`}
                      style={{ width: `${pwdStrength.percent}%` }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirm-pwd" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Confirmar nueva contraseña
                </label>
                <input
                  id="confirm-pwd"
                  type={showPassword ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  required
                  className="mt-1.5 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm font-medium focus:border-[#2563eb] focus:outline-none focus:ring-3 focus:ring-blue-500/20"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 px-5 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#2563eb] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700"
                >
                  Actualizar clave
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Voice Commands Listener */}
      <VoiceCommandButton />
    </div>
  );
}
