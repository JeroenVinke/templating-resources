
export const lifecycleOptionalBehaviors = ['focus', 'if', 'repeat', 'show', 'with'];

function behaviorRequiresLifecycle(instruction) {
  let t = instruction.type;
  let name = t.elementName !== null ? t.elementName : t.attributeName;
  if (lifecycleOptionalBehaviors.indexOf(name) === -1) {
    return t.handlesAttached || t.handlesBind || t.handlesCreated || t.handlesDetached || t.handlesUnbind;
  }
  return instruction.viewFactory && viewsRequireLifecycle(instruction.viewFactory);
}

function targetRequiresLifecycle(instruction) {
  let behaviors = instruction.behaviorInstructions;
  if (behaviors) {
    let i = behaviors.length;
    while (i--) {
      if (behaviorRequiresLifecycle(behaviors[i])) {
        return true;
      }
    }
  }

  return instruction.viewFactory && viewsRequireLifecycle(instruction.viewFactory);
}

export function viewsRequireLifecycle(viewFactory) {
  if ('_viewsRequireLifecycle' in viewFactory) {
    return viewFactory._viewsRequireLifecycle;
  }

  if (viewFactory.viewFactory) {
    viewFactory._viewsRequireLifecycle = viewsRequireLifecycle(viewFactory.viewFactory);
    return viewFactory._viewsRequireLifecycle;
  }

  if (viewFactory.template.querySelector('.au-animate')) {
    viewFactory._viewsRequireLifecycle = true;
    return true;
  }

  for (let id in viewFactory.instructions) {
    if (targetRequiresLifecycle(viewFactory.instructions[id])) {
      viewFactory._viewsRequireLifecycle = true;
      return true;
    }
  }

  viewFactory._viewsRequireLifecycle = false;
  return false;
}