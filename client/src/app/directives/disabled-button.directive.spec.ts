import { DisabledButtonDirective } from './disabled-button.directive';
import { Renderer2, ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

describe('DisabledButtonDirective', () => {
  let directive: DisabledButtonDirective;
  let elementRef: ElementRef;
  let renderer: Renderer2;

  beforeEach(() => {
    // Create a mock for ElementRef
    elementRef = { nativeElement: document.createElement('button') } as ElementRef;

    // Create a spy object for Renderer2 with methods we want to track
    renderer = jasmine.createSpyObj('Renderer2', [
      'setProperty', 'removeClass', 'addClass', 'setAttribute', 'removeAttribute'
    ]);

    // Create the directive instance using the mocked dependencies
    directive = new DisabledButtonDirective(elementRef, renderer);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should disable the button and apply the disabled class when isDisabled is true', () => {
    // Set the directive to a disabled state
    directive.isDisabled = true;
    
    // Call ngOnInit or manually trigger the method that handles the state change
    directive.ngOnInit();

    // Check that the setProperty method is called to disable the button
    expect(renderer.setProperty).toHaveBeenCalledWith(elementRef.nativeElement, 'disabled', true);

    // Check that the correct classes are being removed and added
    expect(renderer.removeClass).toHaveBeenCalledWith(elementRef.nativeElement, 'btn-primary');
    expect(renderer.addClass).toHaveBeenCalledWith(elementRef.nativeElement, 'btn-secondary');
  });

  it('should enable the button and apply the original class when isDisabled is false', () => {
    // Set the directive to an enabled state
    directive.isDisabled = false;
    
    // Call ngOnInit or manually trigger the method that handles the state change
    directive.ngOnInit();

    // Check that the disabled property is removed
    expect(renderer.setProperty).toHaveBeenCalledWith(elementRef.nativeElement, 'disabled', false);

    // Check that the classes are updated back to the original
    expect(renderer.removeClass).toHaveBeenCalledWith(elementRef.nativeElement, 'btn-secondary');
    expect(renderer.addClass).toHaveBeenCalledWith(elementRef.nativeElement, 'btn-primary');
  });
});
