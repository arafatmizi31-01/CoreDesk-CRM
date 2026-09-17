import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

export interface RouteMatch {
  path: string;
  params: Record<string, string>;
}

interface RouterContextType {
  path: string;
  hash: string;
  navigate: (to: string, options?: { replace?: boolean }) => void;
  matchRoute: (pattern: string) => RouteMatch | null;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

function normalizePath(rawPath: string): string {
  if (!rawPath) return '/';
  const clean = rawPath.split('?')[0].split('#')[0];
  return clean === '' ? '/' : clean;
}

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [path, setPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return normalizePath(window.location.pathname);
    }
    return '/';
  });

  const [hash, setHash] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash;
    }
    return '';
  });

  const navigate = useCallback((to: string, options?: { replace?: boolean }) => {
    if (typeof window === 'undefined') return;

    const url = new URL(to, window.location.origin);
    const targetPath = normalizePath(url.pathname);
    const targetHash = url.hash;

    if (options?.replace) {
      window.history.replaceState(null, '', to);
    } else {
      window.history.pushState(null, '', to);
    }

    setPath(targetPath);
    setHash(targetHash);

    // Scroll to top if path changed and no hash anchor is targeted
    if (!targetHash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } else {
      const scrollToHash = () => {
        const id = targetHash.replace(/^#/, '');
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      };
      scrollToHash();
      requestAnimationFrame(scrollToHash);
      setTimeout(scrollToHash, 120);
    }
  }, []);

  useEffect(() => {
    const handleLocationChange = () => {
      setPath(normalizePath(window.location.pathname));
      setHash(window.location.hash);
      if (window.location.hash) {
        const id = window.location.hash.replace(/^#/, '');
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const matchRoute = useCallback(
    (pattern: string): RouteMatch | null => {
      const patternParts = pattern.split('/').filter(Boolean);
      const currentParts = path.split('/').filter(Boolean);

      if (patternParts.length !== currentParts.length) {
        return null;
      }

      const params: Record<string, string> = {};
      for (let i = 0; i < patternParts.length; i++) {
        const pPart = patternParts[i];
        const cPart = currentParts[i];

        if (pPart.startsWith(':')) {
          const paramName = pPart.slice(1);
          params[paramName] = decodeURIComponent(cPart);
        } else if (pPart !== cPart) {
          return null;
        }
      }

      return { path, params };
    },
    [path]
  );

  const value = useMemo(
    () => ({
      path,
      hash,
      navigate,
      matchRoute,
    }),
    [path, hash, navigate, matchRoute]
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
};

export function useRouter(): RouterContextType {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
}

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  replace?: boolean;
}

export const Link: React.FC<LinkProps> = ({ to, replace, onClick, children, ...rest }) => {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.altKey ||
      e.ctrlKey ||
      e.shiftKey ||
      (rest.target && rest.target !== '_self') ||
      to.startsWith('http://') ||
      to.startsWith('https://') ||
      to.startsWith('mailto:') ||
      to.startsWith('tel:')
    ) {
      return;
    }

    e.preventDefault();
    navigate(to, { replace });
  };

  return (
    <a href={to} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
};
