import Markdoc from '@markdoc/markdoc';
import React from 'react';

export function MarkdocContent({ node }: { node: unknown }) {
  // Keystatic's `fields.markdoc` returns a Markdoc AST node.
  // We transform it (apply tags/attrs) and render to React.
  type TransformInput = Parameters<typeof Markdoc.transform>[0];
  type ReactRenderInput = Parameters<typeof Markdoc.renderers.react>[0];

  const transformed = Markdoc.transform(node as TransformInput);
  return <>{Markdoc.renderers.react(transformed as ReactRenderInput, React)}</>;
}


