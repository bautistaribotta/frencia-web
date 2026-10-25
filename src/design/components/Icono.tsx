/* Icono de Lucide con el trazo del sistema (1.75) y el color del texto.
   Tamaños: 16 en linea, 18-20 en controles, 24 en navegacion.
   Si el icono tiene version animada en @animateicons/react, se usa esa:
   anima al aparecer (cuando se entra a la vista) y cada vez que el mouse
   entra al control que lo contiene (el boton, el enlace, la fila) o el
   control toma el foco de teclado. Con reducir movimiento queda quieto; la
   libreria ya lo respeta. Los que no tienen version animada van estaticos. */

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  CameraIcon,
  CheckIcon,
  ChevronRightIcon,
  CircleAlertIcon,
  EyeIcon,
  EyeOffIcon,
  FileTextIcon,
  FlameIcon,
  HistoryIcon,
  HouseIcon,
  InfoIcon,
  LayersIcon,
  LockIcon,
  LogOutIcon,
  MailIcon,
  MonitorIcon,
  MoonIcon,
  PencilIcon,
  PlusIcon,
  RepeatIcon,
  RotateCwIcon,
  SettingsIcon,
  ShieldIcon,
  SmartphoneIcon,
  SunIcon,
  Trash2Icon,
  TriangleAlertIcon,
  UploadIcon,
  UserIcon,
  XIcon,
} from '@animateicons/react/lucide';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Camera,
  Check,
  ChevronRight,
  CircleAlert,
  Eye,
  EyeOff,
  FileText,
  Flame,
  History,
  House,
  Info,
  Layers,
  Lock,
  LogOut,
  Mail,
  Monitor,
  Moon,
  Pencil,
  Plus,
  Repeat,
  RotateCw,
  Settings,
  Shield,
  Smartphone,
  Sun,
  Trash2,
  TriangleAlert,
  Upload,
  User,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useRef, type ComponentType, type RefAttributes } from 'react';

import styles from './Icono.module.css';

interface ManejoAnimacion {
  startAnimation: () => void;
  stopAnimation: () => void;
}

type IconoAnimable = ComponentType<{ size?: number; className?: string } & RefAttributes<ManejoAnimacion>>;

// Lista explicita (y no un import de todo el paquete) para que el bundle
// lleve solo los iconos que se usan. Un icono nuevo se suma aca.
const ANIMADOS = new Map<LucideIcon, IconoAnimable>([
  [ArrowLeft, ArrowLeftIcon],
  [ArrowRight, ArrowRightIcon],
  [ArrowUpRight, ArrowUpRightIcon],
  [Camera, CameraIcon],
  [Check, CheckIcon],
  [ChevronRight, ChevronRightIcon],
  [CircleAlert, CircleAlertIcon],
  [Eye, EyeIcon],
  [EyeOff, EyeOffIcon],
  [FileText, FileTextIcon],
  [Flame, FlameIcon],
  [History, HistoryIcon],
  [House, HouseIcon],
  [Info, InfoIcon],
  [Layers, LayersIcon],
  [Lock, LockIcon],
  [LogOut, LogOutIcon],
  [Mail, MailIcon],
  [Monitor, MonitorIcon],
  [Moon, MoonIcon],
  [Pencil, PencilIcon],
  [Plus, PlusIcon],
  [Repeat, RepeatIcon],
  [RotateCw, RotateCwIcon],
  [Settings, SettingsIcon],
  [Shield, ShieldIcon],
  [Smartphone, SmartphoneIcon],
  [Sun, SunIcon],
  [Trash2, Trash2Icon],
  [TriangleAlert, TriangleAlertIcon],
  [Upload, UploadIcon],
  [User, UserIcon],
  [X, XIcon],
]);

/** Lo que tarda en animar al aparecer: deja que la vista termine de entrar. */
const DEMORA_AL_APARECER_MS = 150;

// Si el icono esta dentro de un control, el hover y el foco de ese control
// lo disparan; si no, el hover del propio icono.
const CONTROL = 'a, button, label, [role="button"]';

interface Props {
  icono: LucideIcon;
  tamano?: 12 | 14 | 16 | 18 | 20 | 24 | 26 | 28 | 32;
  className?: string;
}

export function Icono({ icono, tamano = 20, className = '' }: Props) {
  const Animado = ANIMADOS.get(icono);
  if (!Animado) {
    const Estatico = icono;
    return <Estatico size={tamano} strokeWidth={1.75} className={className} aria-hidden="true" focusable="false" />;
  }
  return <IconoAnimado animado={Animado} tamano={tamano} className={className} />;
}

function IconoAnimado({ animado: Animado, tamano, className }: { animado: IconoAnimable; tamano: number; className: string }) {
  const caja = useRef<HTMLSpanElement>(null);
  const manejo = useRef<ManejoAnimacion>(null);

  useEffect(() => {
    const el = caja.current;
    if (!el) return;
    const disparador = el.closest<HTMLElement>(CONTROL) ?? el;
    const animar = () => manejo.current?.startAnimation();
    const alEnfocar = () => {
      if (disparador.matches(':focus-visible')) animar();
    };
    disparador.addEventListener('mouseenter', animar);
    disparador.addEventListener('focus', alEnfocar);
    const alAparecer = window.setTimeout(animar, DEMORA_AL_APARECER_MS);
    return () => {
      window.clearTimeout(alAparecer);
      disparador.removeEventListener('mouseenter', animar);
      disparador.removeEventListener('focus', alEnfocar);
    };
  }, []);

  return (
    <span ref={caja} className={`${styles.icono} ${className}`} aria-hidden="true">
      <Animado ref={manejo} size={tamano} className={styles.dibujo} />
    </span>
  );
}
