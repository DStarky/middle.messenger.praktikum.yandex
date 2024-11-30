import Handlebars from 'handlebars';

export abstract class BasePage {
  protected template: HandlebarsTemplateDelegate;

  constructor(template: string) {
    this.template = Handlebars.compile(template);
  }

  render(context: Record<string, unknown> = {}): string {
    return this.template(context);
  }
}
