import { createElement, type ComponentType } from "react";
import type { Components } from "react-markdown";

/**
 * react-markdown hands every component the raw hast `node`. It is metadata, not
 * DOM content, so it must be dropped before the props reach an element.
 *
 * The wrapped map has to keep a stable identity — a new component function on
 * every render makes react-markdown remount the whole tree.
 */
export function withoutNodeProp(components: Components): Components {
  const entries = Object.entries(components).map(([tag, Component]) => {
    if (typeof Component !== "function") return [tag, Component];

    const Wrapped = (props: Record<string, unknown>) =>
      createElement(Component as ComponentType<Record<string, unknown>>, {
        ...props,
        node: undefined,
      });

    return [tag, Wrapped];
  });

  return Object.fromEntries(entries) as Components;
}
