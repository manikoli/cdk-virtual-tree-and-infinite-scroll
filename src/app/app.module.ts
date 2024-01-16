import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TreeComponent } from './tree/tree.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkTreeModule } from '@angular/cdk/tree';

import { CdkTableModule } from '@angular/cdk/table';
import { TempFakeApiService } from './tree/tempFakeApi.service';
import { TreeNodeService } from './tree/tree.service';
import { CdkTreeComponent } from './cdk-tree/cdk-tree.component';
import { VirtualScrollDirective } from './virtual-scroll.directive';
import { TestTreeComponent } from './test-tree/test-tree.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { VsTreeComponent } from './vs-tree/vs-tree.component';
import { VsCdkTreeComponent } from './vs-cdk-tree/vs-cdk-tree.component';

@NgModule({
  declarations: [
    AppComponent,
    TreeComponent,
    CdkTreeComponent,
    VirtualScrollDirective,
    TestTreeComponent,
    VsTreeComponent,
    VsCdkTreeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTreeModule,
    MatButtonModule,
    MatIconModule,
    ScrollingModule,
    CdkTreeModule,
    CdkTableModule,
    MatProgressBarModule,
  ],
  providers: [TempFakeApiService, TreeNodeService],
  bootstrap: [AppComponent],
})
export class AppModule {}
