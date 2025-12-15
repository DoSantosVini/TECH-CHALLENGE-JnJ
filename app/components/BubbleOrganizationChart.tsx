'use client';

import React, {
  useMemo,
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* =========================
   TIPOS
========================= */
type Status = 'Active' | 'Inactive';

interface Person {
  id: number;
  name: string;
  jobTitle: string;
  department: string;
  managerId: number | null;
  status: Status;
}

interface HierarchyNode {
  person: Person;
  level: number;
  children: HierarchyNode[];
}

/* =========================
   CONFIGURAÇÃO DE CORES POR NÍVEL
========================= */
const LEVEL_COLORS = {
  1: 'bg-[#EB1700] text-white', // Organização - Vermelho J&J
  2: 'bg-blue-700 text-white',   // Departamentos - Azul
  3: 'bg-green-600 text-white',  // Gerentes - Verde
  4: 'bg-purple-600 text-white', // Supervisores - Roxo
  5: 'bg-gray-500 text-white',   // Colaboradores - Cinza
};

const LEVEL_SIZES = {
  1: 'lg' as const,
  2: 'md' as const,
  3: 'sm' as const,
  4: 'sm' as const,
  5: 'sm' as const,
};

/* =========================
   BOLHA BASE
========================= */
function Bubble({
  size,
  color,
  children,
  refProp,
  onClick,
}: {
  size: 'lg' | 'md' | 'sm';
  color: string;
  children: React.ReactNode;
  refProp?: (el: HTMLDivElement | null) => void;
  onClick?: () => void;
}) {
  const sizes = {
    lg: 'w-32 h-32',
    md: 'w-24 h-24',
    sm: 'w-16 h-16',
  };

  return (
    <motion.div
      ref={refProp}
      onClick={onClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.1, boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}
      className={`
        ${sizes[size]}
        rounded-full
        flex items-center justify-center text-center
        shadow-md
        cursor-pointer
        ${color}
      `}
    >
      {children}
    </motion.div>
  );
}

/* =========================
   COMPONENTE PRINCIPAL
========================= */
export default function BubbleOrganizationChart() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());
  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number }[]>([]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Carregar dados
  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await fetch('/api/people');
        if (!response.ok) throw new Error('Erro ao buscar dados');
        const data = await response.json();
        
        // Normalizar dados: converter managerId string para number
        const normalizedData = data.map((p: any) => ({
          ...p,
          id: typeof p.id === 'string' ? parseInt(p.id) : p.id,
          managerId: p.managerId ? (typeof p.managerId === 'string' ? parseInt(p.managerId) : p.managerId) : null
        }));
        
        console.log('Dados normalizados:', normalizedData.length, 'pessoas');
        setPeople(normalizedData);
        
        // Encontrar CEO e adicionar ao expandedNodes
        const ceo = normalizedData.find((p: Person) => !p.managerId);
        if (ceo) {
          setExpandedNodes(new Set([ceo.id]));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPeople();
  }, []);

  // Construir hierarquia
  const hierarchy = useMemo(() => {
    if (people.length === 0) return null;

    // Encontrar CEO (sem managerId)
    const ceo = people.find(p => !p.managerId);
    if (!ceo) return null;

    // Construir árvore recursivamente
    const buildTree = (person: Person, level: number): HierarchyNode => {
      const children = people
        .filter(p => p.managerId === person.id)
        .map(child => buildTree(child, level + 1))
        .sort((a, b) => a.person.name.localeCompare(b.person.name));

      return { person, level, children };
    };

    return buildTree(ceo, 1);
  }, [people]);

  // Toggle nó
  const toggleNode = (nodeId: number) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
        // Fechar todos os filhos também
        const closeChildren = (id: number) => {
          people.filter(p => p.managerId === id).forEach(child => {
            newSet.delete(child.id);
            closeChildren(child.id);
          });
        };
        closeChildren(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  // Renderizar nó e seus filhos
  const renderNode = (node: HierarchyNode, depth: number = 0) => {
    const isExpanded = expandedNodes.has(node.person.id);
    const hasChildren = node.children.length > 0;
    const color = LEVEL_COLORS[node.level as keyof typeof LEVEL_COLORS] || 'bg-gray-400 text-white';
    const size = LEVEL_SIZES[node.level as keyof typeof LEVEL_SIZES] || 'sm';

    return (
      <div key={node.person.id} className="flex flex-col items-center">
        <Bubble
          size={size}
          color={color}
          refProp={(el) => (nodeRefs.current[node.person.id] = el)}
          onClick={() => hasChildren && toggleNode(node.person.id)}
        >
          <div className="px-2">
            <div className="text-xs font-bold truncate">{node.person.name.split(' ')[0]}</div>
            <div className="text-[9px] opacity-90 truncate">{node.person.jobTitle}</div>
            {hasChildren && (
              <div className="text-[8px] mt-0.5">
                {isExpanded ? '▼' : '▶'} ({node.children.length})
              </div>
            )}
          </div>
        </Bubble>

        <AnimatePresence>
          {isExpanded && hasChildren && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex gap-6 flex-wrap justify-center mt-8"
            >
              {node.children.map(child => renderNode(child, depth + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // Calcular linhas SVG
  useLayoutEffect(() => {
    if (!containerRef.current || !hierarchy) return;

    // Delay para garantir que as animações terminaram
    const timer = setTimeout(() => {
      const cRect = containerRef.current?.getBoundingClientRect();
      if (!cRect) return;

      const newLines: typeof lines = [];

      const getCenter = (el: HTMLDivElement | null) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          x: r.left - cRect.left + r.width / 2,
          yTop: r.top - cRect.top,
          yBottom: r.bottom - cRect.top,
        };
      };

      // Percorrer hierarquia e criar linhas
      const drawLines = (node: HierarchyNode) => {
        if (!expandedNodes.has(node.person.id)) return;

        const parentEl = nodeRefs.current[node.person.id];
        const parentPos = getCenter(parentEl);

        node.children.forEach(child => {
          const childEl = nodeRefs.current[child.person.id];
          const childPos = getCenter(childEl);

          if (parentPos && childPos) {
            newLines.push({
              x1: parentPos.x,
              y1: parentPos.yBottom,
              x2: childPos.x,
              y2: childPos.yTop,
            });
          }

          drawLines(child);
        });
      };

      if (hierarchy) drawLines(hierarchy);
      setLines(newLines);
    }, 350); // Espera a animação terminar (300ms + margem)

    return () => clearTimeout(timer);
  }, [expandedNodes, hierarchy, people]);

  if (loading) {
    return (
      <div className="relative min-h-screen py-12 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-gray-600 text-lg">Carregando organograma...</div>
      </div>
    );
  }

  if (!hierarchy) {
    return (
      <div className="relative min-h-screen py-12 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-gray-600 text-lg">Nenhum dado disponível</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative min-h-screen py-12 bg-gradient-to-br from-gray-50 to-gray-100">
      {/* LINHAS */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        <AnimatePresence>
          {lines.map((l, i) => (
            <motion.line
              key={`${l.x1}-${l.y1}-${l.x2}-${l.y2}-${i}`}
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              stroke="#94A3B8"
              strokeWidth="2"
              strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              exit={{ pathLength: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </AnimatePresence>
      </svg>

      {/* HIERARQUIA */}
      <div className="relative z-10 px-4">
        {renderNode(hierarchy)}
      </div>

      {/* LEGENDA */}
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 text-xs">
        <div className="font-bold mb-2">Níveis Hierárquicos</div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-4 h-4 rounded-full bg-[#EB1700]"></div>
          <span>CEO</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-4 h-4 rounded-full bg-blue-700"></div>
          <span>Vice Presidente</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-4 h-4 rounded-full bg-green-600"></div>
          <span>Diretor/Senior Manager</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-4 h-4 rounded-full bg-purple-600"></div>
          <span>Manager</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gray-500"></div>
          <span>Staffs</span>
        </div>
      </div>
    </div>
  );
}
