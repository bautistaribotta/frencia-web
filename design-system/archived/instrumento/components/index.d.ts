/* Frencia — tipos de los componentes de window.FrenciaDesignSystem_377129 (documentacion, no se chequean). */
import * as React from 'react';

// ---- Avatar
export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Image URL. Falls back to initials when absent. */
  src?: string;
  /** Full name — used for initials and alt text. */
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Anillo de tinta alrededor (usuario activo). */
  ring?: boolean;
}

/** Circular user avatar with initials fallback. */
export function Avatar(props: AvatarProps): React.ReactElement;

// ---- Badge
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Color/role. Solid tones for emphatic states (e.g. NUEVO PR). */
  /** `green`, `green-solid`, `orange` y `orange-solid` siguen aceptados como alias. */
  tone?: 'neutral' | 'signal' | 'accent-solid' | 'intensity' | 'intensity-solid' | 'danger';
  /** Optional leading Lucide icon name. */
  icon?: string;
  children?: React.ReactNode;
}

/** Marca de estado compacta en mayusculas: tipo de serie, RIR/RPE, PR. */
export function Badge(props: BadgeProps): React.ReactElement;

// ---- Button
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** `primary` = tinta (la accion principal), `intensity` = ambar (PR/esfuerzo), `secondary` = hairline, `ghost` = texto, `soft` = texto en senal, `danger` = carmin delineado. */
  variant?: 'primary' | 'intensity' | 'secondary' | 'ghost' | 'soft' | 'danger';
  /** Control height. */
  size?: 'sm' | 'md' | 'lg';
  /** Stretch to fill the container width. */
  fullWidth?: boolean;
  /** Lucide icon name rendered before the label (e.g. "plus", "play"). */
  icon?: string;
  /** Lucide icon name rendered after the label (e.g. "chevron-right"). */
  iconRight?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

/**
 * Boton de Frencia. primary es tinta: marfil en oscuro, casi negro en claro.
 * intensity (ambar) solo para PR y esfuerzo, uno por pantalla como mucho.
 */
export function Button(props: ButtonProps): React.ReactElement;

// ---- Card
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** `default` plana con hairline, `elevated` flotante con sombra, `inset` pozo, `signal`/`intensity` estado. `green`/`orange` siguen como alias. */
  variant?: 'default' | 'elevated' | 'inset' | 'signal' | 'intensity';
  /** Add a subtle hairline border. */
  hairline?: boolean;
  /** Press/hover affordance for tappable cards. */
  interactive?: boolean;
  children?: React.ReactNode;
}

/** Surface container. Steps by lightness; reserve `elevated` shadow for floating content. */
export function Card(props: CardProps): React.ReactElement;

// ---- IconButton
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Lucide icon name (e.g. "plus", "timer", "x"). */
  icon: string;
  variant?: 'primary' | 'surface' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  /** Fully circular instead of rounded-square. */
  round?: boolean;
  disabled?: boolean;
}

/** Icon-only button — toolbars, steppers, nav. Min 44px hit target at `md`/`lg`. */
export function IconButton(props: IconButtonProps): React.ReactElement;

// ---- Tag
export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Estado elegido (filtro): relleno de tinta. */
  selected?: boolean;
  /** Adds hover/cursor affordance for filter chips. */
  selectable?: boolean;
  /** Show a leading color dot. */
  dot?: boolean;
  children?: React.ReactNode;
}

/** Pill tag for muscle groups, categories and filter chips. */
export function Tag(props: TagProps): React.ReactElement;

// ---- MetricPill
export interface MetricPillProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Leading Lucide icon name. */
  icon?: string;
  /** Rotulo en mayusculas. */
  label?: string;
  /** The value (string or node). */
  value: React.ReactNode;
  /** `green`/`orange` siguen como alias de `signal`/`intensity`. */
  tone?: 'neutral' | 'signal' | 'intensity';
  /** `stack` = label over value; `inline` = side by side. */
  layout?: 'stack' | 'inline';
}

/** Compact inline metric chip — rest timer, RIR, pace, heart-rate readouts. */
export function MetricPill(props: MetricPillProps): React.ReactElement;

// ---- ProgressBar
export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current value (or, when `segments` set, number of filled segments). */
  value?: number;
  /** Max for continuous mode. Default 100. */
  max?: number;
  /** Rotulo en mayusculas arriba de la pista. */
  label?: string;
  /** Show the % (or n/total) on the right. */
  showValue?: boolean;
  /** Relleno: `accent` (tinta, por defecto), `signal` o `intensity`. `green`/`orange` siguen como alias. */
  tone?: 'accent' | 'signal' | 'intensity';
  size?: 'sm' | 'md' | 'lg';
  /** Render as N discrete segments (e.g. sets completed) instead of a bar. */
  segments?: number;
}

/** Progress / completion bar — continuous or segmented (sets done). */
export function ProgressBar(props: ProgressBarProps): React.ReactElement;

// ---- SetRow
export interface SetRowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Set number (1-based). */
  index: number;
  /** Load value (number or string). */
  load: React.ReactNode;
  /** Reps value. */
  reps: React.ReactNode;
  /** Load unit. Default "kg". */
  unit?: string;
  /** RIR de la serie; se muestra en ambar. */
  rir?: number;
  /** Row state — drives styling and the check toggle. */
  state?: 'pending' | 'active' | 'done';
  /** Toggle completion. */
  onToggle?: () => void;
}

/**
 * One logged set in a workout: index · load × reps · RIR · completion check.
 * The atomic unit of FRENCIA logging.
 */
export function SetRow(props: SetRowProps): React.ReactElement;

// ---- StatTile
export interface StatTileProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Rotulo en mayusculas arriba del numero. */
  label?: string;
  /** The headline number (string or node). */
  value: React.ReactNode;
  /** Trailing unit (e.g. "kg", "min"). */
  unit?: string;
  /** Optional change indicator value (e.g. "+5"). */
  delta?: React.ReactNode;
  /** Direction of the delta arrow/color. */
  deltaDir?: 'up' | 'down';
  /** Numeral scale. */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Color del numero: `signal` (acero) o `intensity` (ambar). `green`/`orange` siguen como alias. */
  tone?: 'default' | 'signal' | 'intensity';
  children?: React.ReactNode;
}

/**
 * El numero como mensaje: cifras condensadas y tabulares bajo un rotulo,
 * with an optional progression delta.
 */
export function StatTile(props: StatTileProps): React.ReactElement;

// ---- Stepper
export interface StepperProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Rotulo arriba del control ("Peso", "Reps"). */
  label?: string;
  /** Current numeric value (controlled). */
  value: number;
  /** Called with the next clamped value. */
  onChange?: (value: number) => void;
  /** Increment per tap. Default 1 (use 2.5 for plate math). */
  step?: number;
  min?: number;
  max?: number;
  /** Trailing unit shown inline (e.g. "kg"). */
  unit?: string;
  /** Decimal places to keep. Default 0. */
  precision?: number;
  size?: 'md' | 'lg';
  /** Text shown instead of the number (e.g. RIR -1 renders as "Fallo"). */
  format?: (value: number) => string;
  /** Stretch to the container: the buttons go to the edges. */
  fullWidth?: boolean;
}

/** Paso numerico para reps y carga: valor condensado y tabular entre - y +. */
export function Stepper(props: StepperProps): React.ReactElement;

// ---- Checkbox
export interface CheckboxProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  /** Checked state (controlled). */
  checked?: boolean;
  /** Toggle handler. Omit it to render a static indicator that the parent marks. */
  onChange?: (next: boolean) => void;
  disabled?: boolean;
}

/**
 * Casilla cuadrada de Frencia. Marcada = relleno de tinta (accent) con el check
 * en text-on-accent; vacia = borde border-strong (3:1). Sin onChange es un
 * indicador estatico.
 */
export function Checkbox(props: CheckboxProps): React.ReactElement;

// ---- Switch
export interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  /** On/off state (controlled). */
  checked?: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
}

/** Interruptor iOS: pista de tinta encendido, pulgar en text-on-accent. */
export function Switch(props: SwitchProps): React.ReactElement;

// ---- ExerciseMetrics
export type ExerciseKind = 'fuerza' | 'isometrico' | 'cardio' | 'hibrido';
export type MetricKey = 'peso' | 'reps' | 'tiempo' | 'distancia';
export type IntensityScale = 'RIR' | 'RPE';

export interface Exercise {
  id?: string;
  name: string;
  muscle?: string;
  kind: ExerciseKind;
  /** Datos que registra por serie. Híbrido: al menos dos. */
  metrics: MetricKey[];
  /** 'corta' → siempre metros; 'larga' → km o mi según el usuario. Default 'larga'. */
  distScale?: 'corta' | 'larga';
}

export interface ExercisePlan {
  sets: number;
  reps?: number | null;
  /** Segundos. */
  tiempo?: number | null;
  /** En la unidad del ejercicio (m, km o mi). */
  distancia?: number | null;
  intensity?: IntensityScale | null;
  intensityValue?: number | null;
  /** Segundos. */
  rest?: number | null;
}

export interface UnitPrefs { weight?: 'kg' | 'lb'; dist?: 'km' | 'mi'; }

export interface Column { key: MetricKey | 'int'; label: string; unit: string; }

/** Reglas y formatos compartidos por los componentes de registro. No es un componente visual. */
export const ExerciseMetrics: {
  ORDER: MetricKey[];
  KINDS: Record<ExerciseKind, { label: string; icon: string; intensity: 'required' | 'optional'; scales: IntensityScale[] }>;
  LABELS: Record<MetricKey, string>;
  SHORT: Record<MetricKey, string>;
  DASH: string;
  REST_OPTIONS: number[];
  clock(sec: number | null): string;
  durCompact(sec: number | null): string;
  distUnit(ex: Exercise, prefs?: UnitPrefs): 'm' | 'km' | 'mi';
  dist(v: number | null, unit: string, mode?: 'table' | 'compact'): string;
  weight(v: number | null): string;
  metrics(ex: Exercise): MetricKey[];
  planMetrics(ex: Exercise): MetricKey[];
  columns(ex: Exercise, prefs?: UnitPrefs, intensity?: IntensityScale | null): Column[];
  value(key: string, v: number | null, ex: Exercise, prefs?: UnitPrefs, mode?: 'table' | 'compact'): string;
  restVisible(ex: Exercise, sets: number): boolean;
  summary(ex: Exercise, plan: ExercisePlan, prefs?: UnitPrefs): { volume: string; intensity: string | null; rest: string | null; text: string };
};

// ---- DistanceField
export interface DistanceFieldProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  label?: string;
  /** En la unidad indicada. null = sin valor. */
  value: number | null;
  onChange?: (value: number) => void;
  /** 'm' para ejercicios de distancia corta (entero); 'km' | 'mi' según preferencia (2 decimales). */
  unit?: 'm' | 'km' | 'mi';
  /** Ajuste ±. Default 10 (m) o 0.1 (km/mi). */
  step?: number;
  size?: 'md' | 'lg';
  fullWidth?: boolean;
}

/** Entrada de distancia con unidad fija por ejercicio, escritura directa y ajuste ±. */
export function DistanceField(props: DistanceFieldProps): React.ReactElement;

// ---- DurationField
export interface DurationFieldProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Rotulo arriba ("Tiempo por serie"). Muestra el formato esperado a la derecha. */
  label?: string;
  /** Segundos. null = sin valor (muestra el formato como placeholder). */
  value: number | null;
  onChange?: (seconds: number) => void;
  /** Ajuste rápido en segundos. 5 para isométricos, 60 para cardio. Default 5. */
  step?: number;
  /** Permite h:mm:ss (cardio largo). Si no, tope 59:59. */
  allowHours?: boolean;
  /** Muestra los botones ± step. Default true. */
  showSteps?: boolean;
  size?: 'md' | 'lg';
  fullWidth?: boolean;
}

/** Entrada de tiempo m:ss / h:mm:ss con escritura directa y ajuste ± step. Misma piel que Stepper. */
export function DurationField(props: DurationFieldProps): React.ReactElement;

// ---- ExerciseConfig
export interface ExerciseConfigProps extends React.HTMLAttributes<HTMLDivElement> {
  exercise: Exercise;
  /** Plan inicial (editar) o parcial (agregar). */
  plan?: Partial<ExercisePlan>;
  mode?: 'add' | 'edit';
  prefs?: UnitPrefs;
  onBack?: () => void;
  /** Recibe el plan final; rest = null cuando el descanso no aplica. */
  onSubmit?: (plan: ExercisePlan) => void;
}

/**
 * Segunda cara de ExercisePickerModal (agregar / editar un ejercicio en un día).
 * Campos según los datos del ejercicio; sin peso; sin descanso en cardio de 1 serie.
 */
export function ExerciseConfig(props: ExerciseConfigProps): React.ReactElement;

// ---- ExerciseSummary
export interface ExerciseSummaryProps extends React.HTMLAttributes<HTMLSpanElement> {
  exercise: Exercise;
  plan: ExercisePlan;
  prefs?: UnitPrefs;
  size?: 'md' | 'lg';
}

/** Resumen de una línea: volumen · intensidad (ámbar) · descanso (con ícono de reloj). */
export function ExerciseSummary(props: ExerciseSummaryProps): React.ReactElement;

// ---- ExerciseTypeTag
export interface ExerciseTypeTagProps extends React.HTMLAttributes<HTMLSpanElement> {
  kind?: ExerciseKind;
  /** Si se pasa, el tipo se toma de acá y se listan sus datos. */
  exercise?: Exercise;
  /** Default true. */
  showMetrics?: boolean;
  /** inline (listas) | chip (cabeceras). */
  variant?: 'inline' | 'chip';
}

/** Tipo de ejercicio con ícono + texto (nunca solo color) y, opcional, los datos que registra. */
export function ExerciseTypeTag(props: ExerciseTypeTagProps): React.ReactElement;

// ---- IsoTimer
export interface IsoTimerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Objetivo del plan, en segundos. Sin objetivo no hay barra y se muestra "—". */
  target?: number | null;
  /** Duración cargada (segundos). Se completa al frenar y queda editable. */
  value?: number | null;
  onChange?: (seconds: number) => void;
  /** Para maquetas: arrancar en un estado dado. */
  initialPhase?: 'idle' | 'running' | 'done';
  /** Segundos ya contados al montar (maquetas). */
  initialElapsed?: number;
}

/**
 * Cronómetro de esfuerzo (isométricos). Cuenta hacia arriba, barra ámbar con
 * marca de objetivo; "Empezar" → "Frenar" → duración editable.
 */
export function IsoTimer(props: IsoTimerProps): React.ReactElement;

// ---- MarqueeText
export interface MarqueeTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Texto a mostrar en una sola linea. */
  text: string;
}

/**
 * Texto de una linea que nunca hace salto de linea: si no entra, se desplaza
 * de derecha a izquierda como una cinta (marquee), 28 px/s, con pausa de 2 s
 * al comienzo de cada vuelta. Hereda tipografia y color del contenedor.
 */
export function MarqueeText(props: MarqueeTextProps): React.ReactElement;

// ---- RestField
export interface RestFieldProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Rotulo arriba. Default "Descanso entre series". */
  label?: string;
  /** Segundos. null = sin descanso (el campo lo dice en texto). */
  value: number | null;
  /** Segundos elegidos, o null si se confirmo 0:00. */
  onChange?: (seconds: number | null) => void;
}

/** Descanso entre series: campo que abre una hoja inferior con ruedas de minutos y segundos (cada 5 s, hasta 10:55). La hoja se posiciona contra el ancestro con position: relative. */
export function RestField(props: RestFieldProps): React.ReactElement;

// ---- RestRing
export interface RestRingProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Descanso total en segundos. Default 120. */
  total?: number;
  /** Segundos restantes al montar. Default = total. */
  remaining?: number;
  /** Si cuenta. Default true. */
  running?: boolean;
  /** Texto de lo que viene ("Serie 3 de 4 · Plancha"). */
  next?: React.ReactNode;
  onSkip?: () => void;
  onDone?: () => void;
  /** Diámetro del anillo en px. Default 108. */
  size?: number;
}

/** Temporizador de descanso: esfera de 60 marcas con arco de acero que se vacía, +15 s y Saltar. */
export function RestRing(props: RestRingProps): React.ReactElement;

// ---- SerieComparativa
export interface SerieValues { peso?: number | null; reps?: number | null; tiempo?: number | null; distancia?: number | null; intensityValue?: number | null; }

export interface SerieComparativaProps extends React.HTMLAttributes<HTMLDivElement> {
  exercise: Exercise;
  /** Plan de la serie. El peso se ignora: el plan nunca lo prescribe. */
  plan?: ExercisePlan;
  /** Misma serie en la sesión anterior. null/undefined → "—". */
  previous?: SerieValues | null;
  /** Valores cargados hoy (en vivo). Lo que falta → "—". */
  today?: SerieValues;
  /** Escala de intensidad. Default plan.intensity. null = sin columna. */
  intensity?: IntensityScale | null;
  prefs?: UnitPrefs;
  /** Celda de "Hoy" que se está editando (subrayado de acero). */
  activeKey?: string;
  /** Rotulo arriba ("Serie 2 de 3"). */
  title?: string;
}

/** Grilla Plan / Anterior / Hoy con columnas dinámicas según los datos del ejercicio. */
export function SerieComparativa(props: SerieComparativaProps): React.ReactElement;

// ---- SeriesTable
export interface SeriesTableProps extends React.HTMLAttributes<HTMLDivElement> {
  exercise: Exercise;
  /** Series registradas, en orden. */
  sets: SerieValues[];
  /** Escala usada en la sesión; null = sin columna de intensidad. */
  intensity?: IntensityScale | null;
  prefs?: UnitPrefs;
}

/** Tabla de series registradas (historial) con las columnas fijas del ejercicio. */
export function SeriesTable(props: SeriesTableProps): React.ReactElement;

// ---- SegmentedControl
export interface SegmentOption {
  value: string;
  label: string;
  /** Optional leading Lucide icon name. */
  icon?: string;
}

export interface SegmentedControlProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Options as strings or {value,label,icon}. */
  options: Array<string | SegmentOption>;
  /** Selected value. */
  value: string;
  onChange?: (value: string) => void;
  fullWidth?: boolean;
  /** La opcion activa en tinta en lugar de la superficie elevada. */
  accent?: boolean;
}

/** iOS-style segmented control for switching between sibling views/ranges. */
export function SegmentedControl(props: SegmentedControlProps): React.ReactElement;

// ---- TabBar
export interface TabItem {
  value: string;
  label: string;
  /** Lucide icon name. */
  icon: string;
}

export interface TabFab {
  /** Lucide icon name. Default "plus". */
  icon?: string;
  label?: string;
  onClick?: () => void;
}

export interface TabBarProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Tab destinations. */
  items: TabItem[];
  /** Active tab value. */
  value: string;
  onChange?: (value: string) => void;
  /** Optional center floating action (e.g. start workout). Splits items left/right. */
  fab?: TabFab;
}

/** Translucent bottom nav with an optional center action FAB. */
export function TabBar(props: TabBarProps): React.ReactElement;
