export async function resolve(specifier, context, next) {
  const nextResult = await next(specifier, context);

  if (!specifier.endsWith('.pcss')) {
    return nextResult;
  }

  return {
    format: 'pcss',
    shortCircuit: true,
    url: nextResult.url,
  };
}

export async function load(url, context, next) {
  if (context.format !== 'pcss') {
    return next(url, context);
  }

  return {
    format: 'module',
    shortCircuit: true,
    source: '',
  };
}
