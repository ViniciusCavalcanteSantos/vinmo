import {useCallback, useEffect, useRef, useState} from 'react';

interface SectionPosition {
  id: string;
  top: number;
  bottom: number;
}

export const useScrollSpy = (ids: string[], offset: number = 100, fallbackActiveId = '') => {
  const [activeId, setActiveId] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      return window.location.hash.replace('#', '');
    }
    return fallbackActiveId;
  });

  const sectionPositions = useRef<SectionPosition[]>([]);

  const isManualScrolling = useRef(false);
  const scrollEndTimeout = useRef<NodeJS.Timeout | null>(null);
  const hasHandledInitialScroll = useRef(false);

  const measureSections = useCallback(() => {
    const positions: SectionPosition[] = [];

    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        const rect = element.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        const height = rect.height;

        positions.push({
          id,
          top,
          bottom: top + height
        });
      }
    });

    sectionPositions.current = positions.sort((a, b) => a.top - b.top);
  }, [ids]);

  const handleScroll = useCallback(() => {
    if (isManualScrolling.current) return;

    const scrollY = window.scrollY;
    const triggerPoint = scrollY + offset;

    const isBottom = window.scrollY > 0 &&
      (window.innerHeight + scrollY >= document.documentElement.scrollHeight - 50);
    if (isBottom && sectionPositions.current.length > 0) {
      const lastId = sectionPositions.current[sectionPositions.current.length - 1].id;
      setActiveId(prev => (prev !== lastId ? lastId : prev));
      return;
    }

    let currentId = '';
    for (const section of sectionPositions.current) {
      if (triggerPoint >= section.top) {
        currentId = section.id;
      } else {
        break;
      }
    }

    setActiveId(prev => (currentId && prev !== currentId ? currentId : prev));
  }, [offset]);

  useEffect(() => {
    // Função auxiliar para lidar com o hash inicial
    const handleInitialHash = () => {
      if (hasHandledInitialScroll.current) return;

      const hash = window.location.hash.replace('#', '');
      if (!hash) {
        hasHandledInitialScroll.current = true;
        handleScroll();
        return;
      }

      if (ids.includes(hash)) {
        const element = document.getElementById(hash);
        if (element) {
          hasHandledInitialScroll.current = true;
          setActiveId(hash);

          setTimeout(() => {
            element.scrollIntoView({behavior: 'auto'});
          }, 100);
        }
      }
    };

    const initTimeout = setTimeout(() => {
      measureSections();
      handleInitialHash();
    }, 50);

    const resizeObserver = new ResizeObserver(() => {
      measureSections();
      handleScroll();
    });
    resizeObserver.observe(document.body);

    let ticking = false;
    const onScroll = () => {
      if (isManualScrolling.current) {
        if (scrollEndTimeout.current) clearTimeout(scrollEndTimeout.current);
        scrollEndTimeout.current = setTimeout(() => {
          isManualScrolling.current = false;
          handleScroll();
        }, 100);
        return;
      }

      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, {passive: true});
    window.addEventListener('resize', measureSections);

    return () => {
      clearTimeout(initTimeout);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measureSections);
      resizeObserver.disconnect();
      if (scrollEndTimeout.current) clearTimeout(scrollEndTimeout.current);
    };
  }, [ids, measureSections, handleScroll]);

  const setManualScroll = (id: string) => {
    setActiveId(id);
    isManualScrolling.current = true;
  };

  return {activeId, setManualScroll};
};