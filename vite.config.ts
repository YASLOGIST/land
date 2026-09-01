import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

function lucideOptimizePlugin() {
  function pascalToKebab(str: string) {
    const cleaned = str.endsWith('Icon') && str.length > 4 ? str.slice(0, -4) : str
    return cleaned
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/([a-zA-Z])([0-9])/g, '$1-$2')
      .toLowerCase()
  }

  return {
    name: 'lucide-optimize',
    transform(code: string, id: string) {
      if (!id.includes('/node_modules/') && (id.endsWith('.tsx') || id.endsWith('.ts') || id.endsWith('.jsx') || id.endsWith('.js'))) {
        if (code.includes('lucide-react')) {
          const newCode = code.replace(/import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"]/g, (match, importsStr) => {
            const specifiers = importsStr.split(',').map((s: string) => s.trim()).filter(Boolean)
            const importStatements: string[] = []
            for (const spec of specifiers) {
              if (spec.startsWith('type ')) continue
              const parts = spec.split(/\s+as\s+/)
              const importedName = parts[0].trim()
              const localName = (parts[1] || parts[0]).trim()
              if (!importedName || importedName === 'LucideIcon') continue
              const fileName = pascalToKebab(importedName)
              importStatements.push(`import ${localName} from 'lucide-react/dist/esm/icons/${fileName}.js';`)
            }
            return importStatements.join('\n')
          })
          return { code: newCode, map: null }
        }
      }
    }
  }
}

export default defineConfig({
  plugins: [lucideOptimizePlugin(), react({ include: /\.(jsx|tsx)$/ })],
  resolve: {
    alias: {
      '@': path.resolve('.', './src'),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: true,
    fs: {
      strict: false
    }
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    sourcemap: false,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router'],
          'vendor-ui': ['framer-motion'],
          'vendor-charts': ['recharts', 'd3-geo'],
        },
      },
    },
  },
})
