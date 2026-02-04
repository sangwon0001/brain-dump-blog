import { MDXRemote } from 'next-mdx-remote/rsc';
import { createHighlighter } from 'shiki';
import CodeBlock from './CodeBlock';

interface MDXContentProps {
  source: string;
}

// Shiki highlighter (cached)
const highlighterPromise = createHighlighter({
  themes: ['github-dark'],
  langs: ['typescript', 'javascript', 'python', 'bash', 'json', 'markdown', 'css', 'html', 'c', 'cpp', 'go', 'rust', 'java', 'sql', 'yaml', 'shell', 'plaintext'],
});

async function highlightCode(code: string, lang: string): Promise<string> {
  const highlighter = await highlighterPromise;
  const loadedLangs = highlighter.getLoadedLanguages();
  
  // Map similar languages or fallback to plaintext
  let language = lang.toLowerCase();
  const langMap: Record<string, string> = {
    'systemverilog': 'c',
    'verilog': 'c', 
    'sv': 'c',
    'sh': 'bash',
    'zsh': 'bash',
    'js': 'javascript',
    'ts': 'typescript',
    'py': 'python',
    'yml': 'yaml',
  };
  
  if (langMap[language]) {
    language = langMap[language];
  }
  
  if (!loadedLangs.includes(language as never)) {
    language = 'plaintext';
  }
  
  return highlighter.codeToHtml(code, {
    lang: language,
    theme: 'github-dark',
  });
}

// Server component for highlighted code
async function HighlightedCode({ code, language }: { code: string; language: string }) {
  const html = await highlightCode(code.trim(), language);
  return (
    <CodeBlock language={language}>
      <div 
        dangerouslySetInnerHTML={{ __html: html }} 
        className="[&>pre]:!m-0 [&>pre]:!rounded-none [&>pre]:!p-4 [&>pre]:!bg-[#24292e] [&>pre]:!text-sm [&_code]:!text-sm"
      />
    </CodeBlock>
  );
}

const components = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-2xl sm:text-4xl font-bold mt-10 sm:mt-16 mb-4 sm:mb-6 leading-tight" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-xl sm:text-2xl font-bold mt-10 sm:mt-14 mb-4 sm:mb-5 leading-snug" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-lg sm:text-xl font-semibold mt-8 sm:mt-10 mb-3 sm:mb-4 leading-snug" {...props} />
  ),
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="text-base sm:text-lg font-semibold mt-6 sm:mt-8 mb-2 sm:mb-3" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="my-4 sm:my-6 leading-7 sm:leading-8 text-gray-700 dark:text-gray-300" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="my-4 sm:my-6 ml-4 sm:ml-6 space-y-2 sm:space-y-3 list-disc text-gray-700 dark:text-gray-300" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="my-4 sm:my-6 ml-4 sm:ml-6 space-y-2 sm:space-y-3 list-decimal text-gray-700 dark:text-gray-300" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-6 sm:leading-7 pl-1 sm:pl-2" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="border-l-4 border-blue-500 pl-4 sm:pl-6 py-1 my-6 sm:my-8 bg-gray-50 dark:bg-gray-800/50 rounded-r-lg italic text-gray-600 dark:text-gray-400 text-sm sm:text-base" {...props} />
  ),
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="my-8 sm:my-12 border-gray-200 dark:border-gray-700" {...props} />
  ),
  // Inline code
  code: (props: React.HTMLAttributes<HTMLElement>) => {
    const { className, children, ...rest } = props;
    if (className?.startsWith('language-')) {
      return <code className={className} {...rest}>{children}</code>;
    }
    return (
      <code className="bg-gray-100 dark:bg-gray-800 px-1 sm:px-1.5 py-0.5 rounded text-xs sm:text-sm font-mono text-pink-600 dark:text-pink-400 break-words" {...rest}>
        {children}
      </code>
    );
  },
  // Code block
  pre: async (props: React.HTMLAttributes<HTMLPreElement>) => {
    const { children } = props;
    const codeElement = children as React.ReactElement<{ className?: string; children?: string }>;
    const className = codeElement?.props?.className || '';
    const code = codeElement?.props?.children || '';
    const language = className.replace('language-', '') || 'plaintext';
    
    if (typeof code === 'string') {
      return <HighlightedCode code={code} language={language} />;
    }
    
    return (
      <pre className="bg-gray-900 text-gray-100 p-3 sm:p-4 rounded-lg overflow-x-auto my-6 sm:my-8 text-xs sm:text-sm" {...props}>
        {children}
      </pre>
    );
  },
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-blue-600 dark:text-blue-400 hover:underline underline-offset-2 decoration-blue-600/30 break-words" {...props} />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-gray-900 dark:text-white" {...props} />
  ),
  em: (props: React.HTMLAttributes<HTMLElement>) => (
    <em className="italic" {...props} />
  ),
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="rounded-lg sm:rounded-xl my-6 sm:my-10 w-full h-auto shadow-md sm:shadow-lg" alt={props.alt || ''} {...props} />
  ),
};

export default function MDXContent({ source }: MDXContentProps) {
  return (
    <MDXRemote
      source={source}
      components={components}
    />
  );
}
