import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgbModalConfig, NgbTooltipConfig, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgbTooltipModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  constructor(
    private readonly tooltipConfig: NgbTooltipConfig,
    private readonly modalConfig: NgbModalConfig,
  ) {
    tooltipConfig.closeDelay = 300;
    tooltipConfig.openDelay = 300;
    tooltipConfig.placement = 'top';

    modalConfig.windowClass = 'blurred-window';
  }
}
