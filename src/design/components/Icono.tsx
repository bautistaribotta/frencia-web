/* Icono de Lucide con el trazo del sistema (1.75) y el color del texto.
   Tamaños: 16 en linea, 18-20 en controles, 24 en navegacion.
   Si el icono tiene version animada en @animateicons/react, se usa esa:
   anima al aparecer (cuando se entra a la vista) y cada vez que el mouse
   entra al control que lo contiene (el boton, el enlace, la fila) o el
   control toma el foco de teclado. Con reducir movimiento queda quieto; la
   libreria ya lo respeta. Los que no tienen version animada van estaticos.
   La cruz (X) va siempre estatica aunque tenga version animada: cerrar no
   gira. El boton que la contiene conserva su hover (fondo y recuadro).
   El mas (Plus), el de Nueva rutina o Agregar, tambien va siempre estatico.
   Dentro de la caja de un campo (input) los iconos van quietos: ni al
   aparecer ni con hover o foco, tampoco el boton de mostrar la contraseña.
   Solo animan cuando se los dispara a proposito con `disparo`, como el
   icono del campo cuando aparece un error. */

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  CalendarIcon,
  CameraIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleAlertIcon,
  DumbbellIcon,
  EllipsisIcon,
  EyeIcon,
  EyeOffIcon,
  FileTextIcon,
  FlameIcon,
  FootprintsIcon,
  HeartPulseIcon,
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
  PlayIcon,
  RepeatIcon,
  RotateCcwIcon,
  RotateCwIcon,
  RulerIcon,
  SettingsIcon,
  ShareIcon,
  ShieldIcon,
  SmartphoneIcon,
  SunIcon,
  TimerIcon,
  Trash2Icon,
  TriangleAlertIcon,
  UploadIcon,
  UserIcon,
} from '@animateicons/react/lucide';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Dumbbell,
  Ellipsis,
  Eye,
  EyeOff,
  FileText,
  Flame,
  Footprints,
  HeartPulse,
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
  Play,
  Repeat,
  RotateCcw,
  RotateCw,
  Ruler,
  Settings,
  Share,
  Shield,
  Smartphone,
  Sun,
  Timer,
  Trash2,
  TriangleAlert,
  Upload,
  User,
  type LucideIcon,
} from 'lucide-react';
import { createContext, useContext, useEffect, useRef, type ComponentType, type ReactNode, type RefAttributes } from 'react';

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
  [Calendar, CalendarIcon],
  [Camera, CameraIcon],
  [Check, CheckIcon],
  [ChevronLeft, ChevronLeftIcon],
  [ChevronRight, ChevronRightIcon],
  [CircleAlert, CircleAlertIcon],
  [Dumbbell, DumbbellIcon],
  [Ellipsis, EllipsisIcon],
  [Eye, EyeIcon],
  [EyeOff, EyeOffIcon],
  [FileText, FileTextIcon],
  [Flame, FlameIcon],
  [Footprints, FootprintsIcon],
  [HeartPulse, HeartPulseIcon],
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
  [Play, PlayIcon],
  [Repeat, RepeatIcon],
  [RotateCcw, RotateCcwIcon],
  [RotateCw, RotateCwIcon],
  [Ruler, RulerIcon],
  [Settings, SettingsIcon],
  [Share, ShareIcon],
  [Shield, ShieldIcon],
  [Smartphone, SmartphoneIcon],
  [Sun, SunIcon],
  [Timer, TimerIcon],
  [Trash2, Trash2Icon],
  [TriangleAlert, TriangleAlertIcon],
  [Upload, UploadIcon],
  [User, UserIcon],
]);

/** Lo que tarda en animar al aparecer: deja que la vista termine de entrar. */
const DEMORA_AL_APARECER_MS = 150;

// Si el icono esta dentro de un control, el hover y el foco de ese control
// lo disparan; si no, el hover del propio icono.
const CONTROL = 'a, button, label, [role="button"]';

const Quietos = createContext(false);

/** Deja quietos todos los iconos de adentro (la caja de un campo). */
export function IconosQuietos({ children }: { children: ReactNode }) {
  return <Quietos.Provider value={true}>{children}</Quietos.Provider>;
}

interface Props {
  icono: LucideIcon;
  tamano?: 12 | 14 | 16 | 18 | 20 | 24 | 26 | 28 | 32;
  className?: string;
  /** Anima cada vez que pasa a un valor verdadero, aunque el icono este quieto. */
  disparo?: unknown;
}

export function Icono({ icono, tamano = 20, className = '', disparo }: Props) {
  const quieto = useContext(Quietos);
  const Animado = ANIMADOS.get(icono);
  if (!Animado) {
    const Estatico = icono;
    return <Estatico size={tamano} strokeWidth={1.75} className={className} aria-hidden="true" focusable="false" />;
  }
  return <IconoAnimado animado={Animado} tamano={tamano} className={className} quieto={quieto} disparo={disparo} />;
}

interface PropsAnimado {
  animado: IconoAnimable;
  tamano: number;
  className: string;
  quieto: boolean;
  disparo: unknown;
}

function IconoAnimado({ animado: Animado, tamano, className, quieto, disparo }: PropsAnimado) {
  const caja = useRef<HTMLSpanElement>(null);
  const manejo = useRef<ManejoAnimacion>(null);

  useEffect(() => {
    if (disparo) manejo.current?.startAnimation();
  }, [disparo]);

  useEffect(() => {
    const el = caja.current;
    if (!el || quieto) return;
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
  }, [quieto]);

  return (
    <span ref={caja} className={`${styles.icono} ${className}`} aria-hidden="true">
      <Animado ref={manejo} size={tamano} className={styles.dibujo} />
    </span>
  );
}
