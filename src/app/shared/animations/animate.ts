import { trigger, state, style, transition,
  animate, group, query, stagger, keyframes
} from '@angular/animations';

export const SlideInOutAnimation = [
  trigger('slideInOut', [
    state('1', style({ left: '0px', opacity : '1', display: 'block' })),
    state('0', style({ left: '-500px', opacity : '0', display: 'none' })),
    transition('0 => 1', [group([
        animate(100)
      ]
    )]),
    transition('1 => 0', [group([
        animate(150)
      ]
    )])
  ]),
  trigger('subSlideInOut', [
    state('1', style({ left: '0px', opacity : '1', display: 'block' })),
    state('0', style({ left: '500px', opacity : '0', display: 'none' })),
    transition('0 => 1', [group([
        animate(200)
      ]
    )]),
    transition('1 => 0', [group([
        animate(100)
      ]
    )])
  ])
];
export const OpenClose = [
  trigger('openClose', [
    // ...
    state('open', style({
      height: '200px',
      opacity: 1,
      backgroundColor: 'yellow'
    })),
    state('closed', style({
      height: '100px',
      opacity: 0.5,
      backgroundColor: 'green'
    })),
    transition('* => closed', [
      animate('1s')
    ]),
    transition('* => open', [
      animate('0.5s')
    ]),
  ]),
];
export const SlideDownAnimation = [
  trigger('slideDown', [
    state('in', style({
      'max-height': '500px', 'opacity': '1', 'visibility': 'visible', 'min-height': '200px'
    })),
    state('out', style({
      'max-height': '0px', 'opacity': '0', 'visibility': 'hidden', 'min-height': '0px'
    })),
    transition('in => out', [group([
        animate('400ms ease-in-out', style({
          'opacity': '0'
        })),
        animate('600ms ease-in-out', style({
          'max-height': '0px'
        })),
        animate('700ms ease-in-out', style({
          'visibility': 'hidden'
        }))
      ]
    )]),
    transition('out => in', [group([
        animate('11ms ease-in-out', style({
          'opacity': '0'
        })),
        animate('1200ms ease-in-out', style({
          'visibility': 'visible'
        })),
        animate('1600ms ease-in-out', style({
          'max-height': '500px'
        })),
        animate('1800ms ease-in-out', style({
          'opacity': '1'
        }))
      ]
    )]),
    state('*', style({ 'min-height': '200px' })),
  ]),
]
