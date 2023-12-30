import { Component, Renderer2, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CockroachService, Project } from './components/cockroach/cockroach-service.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
    @ViewChild('projectSection') projectSection?: ElementRef;

    functionEndpoint = 'https://main--calm-cat-bdfe20.netlify.app/.netlify/functions/projects';

    expanded: boolean = false;
    allProjects: Project[] = [];
    filteredProjects: Project[] = [];
    expandedLetters?: HTMLElement;

    constructor(private cockroachService: CockroachService, private renderer: Renderer2) {}

    ngOnInit(): void {
        this.loadProjects();
        this.createLetters();
    }

    updateExpand(expanded: boolean) {
        this.expanded = expanded;
    }

    loadProjects(letter: string = ''): void {
        this.cockroachService.fetchProjects(letter).subscribe(
            (data: Project[]) => {
                this.allProjects = data;
            },
            (error) => {
                console.error('Error fetching projects:', error);
            }
        );
    }

    createLetters(): void {
        this.expandedLetters = this.renderer.selectRootElement('#expanded-letters');

        var initials = document.getElementsByClassName('initial');
        for(let i = 0; i < initials.length; i++) {
            const initial = initials[i];

            initial.addEventListener('click', () => this.handleLetterClick(initial.textContent!));
        }

        for (let charCode = 98; charCode <= 121; charCode++) {
            const letter = String.fromCharCode(charCode);
            const h1 = this.renderer.createElement('h1');
            h1.classList.add('expanded-letter');
            h1.textContent = letter;

            this.renderer.listen(h1, 'click', () => {
                this.handleLetterClick(letter);
            });

            this.renderer.appendChild(this.expandedLetters, h1);
        }
    }

    handleLetterClick(letter: string): void {
        if(!this.expanded) return;

        console.log(`Displaying projects for ${letter}`);
        this.filteredProjects = this.filterByLetter(letter);

        console.log(this.filteredProjects);

        if(this.projectSection) {
            if(this.filteredProjects.length > 0) {
                this.projectSection.nativeElement.style.display = 'flex';
                this.projectSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
            } else {
                this.projectSection.nativeElement.style.display = 'none';
            }
        }
    }

    filterByLetter(letter:string) {
        console.log(`All projects: ${this.allProjects.toString()}`);

        return this.allProjects?.filter(obj => obj.title.toLowerCase().startsWith(letter.toLowerCase()));
    }
}